
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
