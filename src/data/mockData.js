// Mock data for the Foot IMU dashboard prototype.
// The data is simulated and is NOT directly from the Kaggle dataset.

// Generate simulated IMU data
export const mockSensorData = Array.from({ length: 100 }, (_, i) => {
  const t = i * 0.1;

  // Simulated accelerometer axes
  const accX = Number((Math.sin(t * 4) * 1.2).toFixed(2));

  const accY = Number((Math.cos(t * 3) * 0.8).toFixed(2));

  const accZ = Number(( Math.sin(t * 5) * 0.7).toFixed(2));

  // Calculate acceleration magnitude from X, Y and Z
  const acceleration = Number(
    Math.sqrt(
      accX ** 2 +
      accY ** 2 +
      accZ ** 2
    ).toFixed(2)
  );

  return {
    time: t.toFixed(1),

    // Acceleration magnitude
    acceleration,

    // Accelerometer
    accX,
    accY,
    accZ,

    // Gyroscope
    gyroX: Number((Math.sin(t * 3) * 1.5).toFixed(2)),
    gyroY: Number((Math.cos(t * 2) * 1.2).toFixed(2)),
    gyroZ: Number((Math.sin(t * 5) * 0.9).toFixed(2)),

    // Magnetometer
    magX: Number((30 + Math.sin(t * 2) * 4).toFixed(2)),
    magY: Number((20 + Math.cos(t * 3) * 3).toFixed(2)),
    magZ: Number((40 + Math.sin(t * 4) * 2).toFixed(2)),

    // Simulated gait phase
    gaitPhase: Number(
      ((Math.sin(t * 2.5) + 1) / 2).toFixed(2)
    ),
  };
});


// Simulated quaternion orientation
export const mockOrientation = {
  q1: 0.812,
  q2: -0.113,
  q3: 0.345,
  q4: 0.212,
};


// Simulated session information
export const mockSession = {
  steps: 42,
  cadence: 108,
  activity: "WALKING",
  duration: "02:14",
  dataRate: "100 Hz",
};


// Simulated gait events
export const mockEvents = [
  { time: "12.53 s", type: "HEEL STRIKE" },
  { time: "12.81 s", type: "FOOT FLAT" },
  { time: "13.17 s", type: "TOE OFF" },
  { time: "13.72 s", type: "HEEL STRIKE" },
];