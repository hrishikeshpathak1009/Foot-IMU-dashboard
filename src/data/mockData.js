// Mock data for the Foot IMU dashboard prototype.
// All values are simulated and are NOT direct measurements from hardware.

export const mockSensorData = Array.from({ length: 250 }, (_, i) => {
  const t = i * 0.1;

  // Accelerometer
  const accX = Number((Math.sin(t * 4) * 1.2 + Math.sin(t * 9) * 0.18).toFixed(2));
  const accY = Number((Math.cos(t * 3) * 0.8 + Math.sin(t * 7) * 0.15).toFixed(2));
  const accZ = Number((9.8 + Math.sin(t * 5) * 0.7 + Math.cos(t * 11) * 0.12).toFixed(2));

  const acceleration = Number(
    Math.sqrt(accX ** 2 + accY ** 2 + accZ ** 2).toFixed(2)
  );

  // Gyroscope
  const gyroX = Number((Math.sin(t * 3) * 150 + Math.sin(t * 13) * 18).toFixed(2));
  const gyroY = Number((Math.cos(t * 2) * 120 + Math.sin(t * 8) * 14).toFixed(2));
  const gyroZ = Number((Math.sin(t * 5) * 90 + Math.cos(t * 12) * 10).toFixed(2));

  // Magnetometer
  const magX = Number((30 + Math.sin(t * 2) * 4).toFixed(2));
  const magY = Number((20 + Math.cos(t * 3) * 3).toFixed(2));
  const magZ = Number((40 + Math.sin(t * 4) * 2).toFixed(2));

  const gaitPhase = Number(((Math.sin(t * 2.5) + 1) / 2).toFixed(2));

  // A smooth demo signal used by the HS/TO chart.
  const filteredGyroY = Number(
    (Math.sin(t * 2.5) * 260 + Math.sin(t * 7) * 25).toFixed(2)
  );

  return {
    time: Number(t.toFixed(1)),
    acceleration,
    accX,
    accY,
    accZ,
    gyroX,
    gyroY,
    gyroZ,
    magX,
    magY,
    magZ,
    gaitPhase,
    filteredGyroY,
  };
});

export const mockOrientation = {
  q1: 0.812,
  q2: -0.113,
  q3: 0.345,
  q4: 0.212,
};

export const mockSession = {
  steps: 42,
  cadence: 108,
  activity: "WALKING",
  duration: "02:14",
  dataRate: "100 Hz",
};

export const mockEvents = [
  { time: "12.53 s", type: "HEEL STRIKE" },
  { time: "12.81 s", type: "FOOT FLAT" },
  { time: "13.17 s", type: "TOE OFF" },
  { time: "13.72 s", type: "HEEL STRIKE" },
];

export const mockGaitMetrics = {
  heelStrikes: 12,
  toeOffs: 12,
  strideCycles: 11,
  validCycles: 10,
  strideTime: 1.21,
  strideTimeStd: 0.18,
  cadence: 99.2,
  cadenceStd: 8.4,
  strideLength: 1.08,
  strideLengthStd: 0.22,
  strideHeight: 7.2,
  strideHeightStd: 2.1,
};

export const mockStrideData = Array.from({ length: 13 }, (_, i) => ({
  stride: i + 1,
  height: Number((7.1 + Math.sin(i * 1.4) * 1.3 + (i % 4 === 0 ? 0.6 : 0)).toFixed(2)),
  robustHeight: Number((7.2 + Math.sin(i * 1.1) * 0.55).toFixed(2)),
  heightValid: i !== 10,
  length: Number((1.02 + Math.sin(i * 0.9) * 0.08 + i * 0.002).toFixed(2)),
  robustLength: Number((1.07 + Math.sin(i * 0.8) * 0.035).toFixed(2)),
  lengthValid: i !== 10,
}));

export const mockEventDetectionData = mockSensorData
  .filter((_, i) => i % 2 === 0)
  .map((d, i) => ({
    time: d.time,
    gyro: d.filteredGyroY,
    heelStrike: i % 12 === 3 || i % 12 === 9 ? d.filteredGyroY : null,
    toeOff: i % 12 === 6 || i % 12 === 0 ? d.filteredGyroY : null,
  }));

export const mockTrajectory = Array.from({ length: 80 }, (_, i) => {
  const t = i / 79;
  return {
    x: Number((t * 10).toFixed(2)),
    y: Number((Math.sin(t * Math.PI * 12) * 0.18).toFixed(3)),
    z: Number((-0.03 + Math.abs(Math.sin(t * Math.PI * 12)) * 0.22).toFixed(3)),
  };
});
