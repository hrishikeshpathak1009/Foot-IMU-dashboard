import { describe, expect, it } from "vitest";
import {
  processSensorRows,
  processEventDetectionData,
  processGaitMetrics,
  processStrideRows,
} from "./imuProcessor.js";

describe("processSensorRows", () => {
  it("returns an empty array when no sensor rows are supplied", () => {
    expect(processSensorRows([])).toEqual([]);
    expect(processSensorRows(null)).toEqual([]);
  });

  it("converts timestamps to relative seconds and calculates acceleration magnitude", () => {
    const result = processSensorRows([
      {
        timestamp: 1000,
        acc_x: 3, acc_y: 4, acc_z: 0,
        gyr_x: 1, gyr_y: 2, gyr_z: 3,
        filtered_gyr_y: 12,
        qw: 1, qx: 0, qy: 0, qz: 0,
      },
      {
        timestamp: 1000.25,
        acc_x: 0, acc_y: 0, acc_z: 9.8,
        gyr_x: 4, gyr_y: 5, gyr_z: 6,
        filtered_gyr_y: "",
        qw: 1, qx: 0, qy: 0, qz: 0,
      },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].time).toBe(0);
    expect(result[1].time).toBe(0.25);
    expect(result[0].acceleration).toBe(5);
    expect(result[1].acceleration).toBeCloseTo(9.8);
    expect(result[0].filteredGyroY).toBe(12);
    expect(result[1].filteredGyroY).toBeNull();
    expect(result[1].gyroZ).toBe(6);
  });
});


describe("processEventDetectionData", () => {
  const sensorRows = [
    { timestamp: 1000, filtered_gyr_y: 10 },
    { timestamp: 1000.1, filtered_gyr_y: 20 },
    { timestamp: 1000.2, filtered_gyr_y: 30 },
  ];

  it("returns no points when there are no sensor rows", () => {
    expect(processEventDetectionData([], [])).toEqual([]);
  });

  it("places heel-strike and toe-off markers on the nearest sensor sample", () => {
    const result = processEventDetectionData(sensorRows, [
      { heel_strike_time: 0.11, toe_off_time: 0.19 },
    ]);

    expect(result[1].heelStrike).toBe(20);
    expect(result[2].toeOff).toBe(30);
    expect(result[0].heelStrike).toBeNull();
  });

  it("does not place markers when events are too far away", () => {
    const result = processEventDetectionData(sensorRows, [
      { heel_strike_time: 1, toe_off_time: null },
    ]);

    expect(result.every((point) => point.heelStrike === null)).toBe(true);
  });

  it("accepts relative event timestamps", () => {
    const result = processEventDetectionData(sensorRows, [
      { heel_strike_time: 0.2 },
    ]);

    expect(result[2].heelStrike).toBe(30);
  });
});


describe("processGaitMetrics", () => {
  it("calculates gait metrics using valid cycles only", () => {
    const temporalRows = [
      {
        valid: true, stride_time_s: 1, cadence_spm: 120,
        stride_length_m: 1.2, stride_height_m: 0.08,
      },
      {
        valid: "true", stride_time_s: 1.2, cadence_spm: 100,
        stride_length_m: 1.0, stride_height_m: 0.06,
      },
      {
        valid: false, stride_time_s: 9, cadence_spm: 9,
        stride_length_m: 9, stride_height_m: 9,
      },
    ];
    const eventRows = [
      { heel_strike_time: 1, toe_off_time: null },
      { heel_strike_time: 2, toe_off_time: 2.5 },
      { heel_strike_time: "", toe_off_time: 3 },
    ];

    const result = processGaitMetrics(temporalRows, eventRows);

    expect(result.heelStrikes).toBe(2);
    expect(result.toeOffs).toBe(2);
    expect(result.strideCycles).toBe(3);
    expect(result.validCycles).toBe(2);
    expect(result.strideTime).toBe(1.1);
    expect(result.strideTimeStd).toBe(0.1);
    expect(result.cadence).toBe(110);
    expect(result.strideLength).toBe(1.1);
    expect(result.strideHeight).toBe(0.07);
  });

  it("returns null averages and standard deviations when no valid measurements exist", () => {
    const result = processGaitMetrics([], []);

    expect(result.heelStrikes).toBe(0);
    expect(result.toeOffs).toBe(0);
    expect(result.strideCycles).toBe(0);
    expect(result.validCycles).toBe(0);
    expect(result.strideTime).toBeNull();
    expect(result.strideTimeStd).toBeNull();
    expect(result.cadence).toBeNull();
    expect(result.strideLength).toBeNull();
    expect(result.strideHeight).toBeNull();
  });

  it("handles numeric and boolean representations of valid", () => {
    const result = processGaitMetrics([
      { valid: 1, stride_time_s: "1.5" },
      { valid: "TRUE", stride_time_s: "2.5" },
      { valid: 0, stride_time_s: "100" },
    ]);

    expect(result.validCycles).toBe(2);
    expect(result.strideTime).toBe(2);
  });
});

describe("processStrideRows", () => {
  it("converts stride height from metres to centimetres and retains validity", () => {
    const result = processStrideRows([
      {
        valid: true, stride_height_m: 0.075, stride_length_m: 1.1,
        invalid_reason: "",
      },
      {
        valid: false, stride_height_m: 0.05, stride_length_m: 0.9,
        invalid_reason: "outlier",
      },
    ]);

    expect(result).toEqual([
      {
        stride: 1, height: 7.5, length: 1.1,
        robustHeight: null, robustLength: null,
        valid: true, reason: "",
      },
      {
        stride: 2, height: 5, length: 0.9,
        robustHeight: null, robustLength: null,
        valid: false, reason: "outlier",
      },
    ]);
  });

  it("ignores rows with no usable height or length", () => {
    expect(processStrideRows([
      { valid: true, stride_height_m: "", stride_length_m: "not-a-number" },
      { valid: true, stride_height_m: 0.06, stride_length_m: null },
    ])).toHaveLength(1);
  });

  it("returns an empty array for missing input", () => {
    expect(processStrideRows(undefined)).toEqual([]);
  });
});
