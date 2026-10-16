
export function processSensorRows(rows) {
  if (!rows || rows.length === 0) return [];

  const firstTimestamp = Number(rows[0].timestamp);

  return rows.map((row) => {
    const accX = Number(row.acc_x);
    const accY = Number(row.acc_y);
    const accZ = Number(row.acc_z);

    return {
      // Relative time in seconds
      time: Number(
        (Number(row.timestamp) - firstTimestamp).toFixed(3)
      ),

      accX,
      accY,
      accZ,

      acceleration: Math.sqrt(
        accX ** 2 + accY ** 2 + accZ ** 2
      ),

      gyroX: Number(row.gyr_x),
      gyroY: Number(row.gyr_y),
      gyroZ: Number(row.gyr_z),

      filteredGyroY:
        row.filtered_gyr_y === "" ||
        row.filtered_gyr_y == null
          ? null
          : Number(row.filtered_gyr_y),

      qw: Number(row.qw),
      qx: Number(row.qx),
      qy: Number(row.qy),
      qz: Number(row.qz),
    };
  });
}

export function processEventDetectionData(sensorRows, eventRows) {
  if (!sensorRows?.length) return [];

  const firstTimestamp = Number(sensorRows[0].timestamp);

  // Raw timestamps appear to be Unix timestamps in seconds.
  const points = sensorRows.map((row) => {
    const timestamp = Number(row.timestamp);
    const rawGyro = Number(row.filtered_gyr_y);

    return {
      time: Number((timestamp - firstTimestamp).toFixed(3)),
      gyro: Number.isFinite(rawGyro) ? rawGyro : null,
      heelStrike: null,
      toeOff: null,
    };
  });

  function toRelativeTime(value) {
    const timestamp = Number(value);

    if (!Number.isFinite(timestamp)) return null;

    // Handle absolute Unix timestamps versus relative timestamps.
    return timestamp > 100_000_000
      ? timestamp - firstTimestamp
      : timestamp;
  }

  function addEventMarker(eventTime, field) {
    const time = toRelativeTime(eventTime);
    if (time === null) return;

    let closestIndex = -1;
    let smallestDifference = Infinity;

    points.forEach((point, index) => {
      const difference = Math.abs(point.time - time);

      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestIndex = index;
      }
    });

    // Only place a marker if it aligns with a sensor sample.
    if (closestIndex === -1 || smallestDifference > 0.1) return;

    points[closestIndex][field] = points[closestIndex].gyro;
  }

  (eventRows || []).forEach((event) => {
    addEventMarker(event.heel_strike_time, "heelStrike");
    addEventMarker(event.toe_off_time, "toeOff");
  });

  return points;
}

function isValidCycle(row) {
  const value = row.valid;

  return (
    value === true ||
    value === 1 ||
    String(value).toLowerCase() === "true"
  );
}

function numericValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function average(values) {
  const validValues = values.filter((value) => value !== null);

  if (!validValues.length) return null;

  return validValues.reduce((sum, value) => sum + value, 0)
    / validValues.length;
}

function standardDeviation(values) {
  const validValues = values.filter((value) => value !== null);

  if (validValues.length < 2) return null;

  const avg = average(validValues);

  return Math.sqrt(
    validValues.reduce((sum, value) => sum + (value - avg) ** 2, 0)
      / validValues.length
  );
}

function round(value, digits = 2) {
  return value === null ? null : Number(value.toFixed(digits));
}

export function processGaitMetrics(temporalRows, eventRows = []) {
  const rows = temporalRows || [];

  // Exclude invalid and non-cycle rows from numerical summaries.
  const validRows = rows.filter(isValidCycle);

  const getValues = (field) =>
    validRows.map((row) => numericValue(row[field]))
      .filter((value) => value !== null);

  const strideTimes = getValues("stride_time_s");
  const cadences = getValues("cadence_spm");
  const lengths = getValues("stride_length_m");
  const heights = getValues("stride_height_m");

  const heelStrikes = eventRows.filter(
    (row) => numericValue(row.heel_strike_time) !== null
  ).length;

  const toeOffs = eventRows.filter(
    (row) => numericValue(row.toe_off_time) !== null
  ).length;

  return {
    heelStrikes,
    toeOffs,
    strideCycles: rows.filter(
      (row) => numericValue(row.stride_time_s) !== null
    ).length,
    validCycles: validRows.length,

    strideTime: round(average(strideTimes)),
    strideTimeStd: round(standardDeviation(strideTimes)),

    cadence: round(average(cadences)),
    cadenceStd: round(standardDeviation(cadences)),

    strideLength: round(average(lengths)),
    strideLengthStd: round(standardDeviation(lengths)),

    // Keep height in metres internally.
    strideHeight: round(average(heights), 3),
    strideHeightStd: round(standardDeviation(heights), 3),
  };
}


export function processStrideRows(temporalRows) {
  return (temporalRows || [])
    .map((row, index) => {
      const heightM = numericValue(row.stride_height_m);
      const lengthM = numericValue(row.stride_length_m);

      // Keep rejected cycles visible when their measurements exist.
      return {
        stride: index + 1,

        // Chart axis expects centimetres for height.
        height: heightM === null ? null : heightM * 100,

        // Chart axis expects metres for length.
        length: lengthM,

        // Don't fabricate a robust estimate.
        robustHeight: null,
        robustLength: null,

        valid: isValidCycle(row),
        reason: row.invalid_reason || "",
      };
    })
    .filter((row) => row.height !== null || row.length !== null);
}
