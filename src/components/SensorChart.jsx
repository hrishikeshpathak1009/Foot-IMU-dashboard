import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function SensorChart({ data }) {
  const [sensorType, setSensorType] = useState("acc");

  const sensorConfig = {
    acc: {
      title: "Accelerometer",
      xKey: "accX",
      yKey: "accY",
      zKey: "accZ",
    },

    gyro: {
      title: "Gyroscope",
      xKey: "gyroX",
      yKey: "gyroY",
      zKey: "gyroZ",
    },

    mag: {
      title: "Magnetometer",
      xKey: "magX",
      yKey: "magY",
      zKey: "magZ",
    },
  };

  const currentSensor = sensorConfig[sensorType];

  return (
    <div className="card">

      {/* Header */}
      <div className="card-header">

        <div>
          <div className="card-title">
            SENSOR DATA
          </div>

          <div className="card-subtitle">
            {currentSensor.title}
          </div>
        </div>

      </div>


      {/* Chart */}
      <div className="chart-container sensor-chart">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
            />

            <YAxis
              tick={{ fontSize: 11 }}
            />

            <Tooltip />

            <Legend />


            {/* X AXIS */}
            <Line
              type="monotone"
              dataKey={currentSensor.xKey}
              name="X"
              dot={false}
              stroke="#3B82F6"
              strokeWidth={2}
            />


            {/* Y AXIS */}
            <Line
              type="monotone"
              dataKey={currentSensor.yKey}
              name="Y"
              dot={false}
              stroke="#22C55E"
              strokeWidth={2}
            />


            {/* Z AXIS */}
            <Line
              type="monotone"
              dataKey={currentSensor.zKey}
              name="Z"
              dot={false}
              stroke="#F59E0B"
              strokeWidth={2}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* Sensor selector */}
      <div className="sensor-tabs">

        <button
          className={sensorType === "acc" ? "active" : ""}
          onClick={() => setSensorType("acc")}
        >
          ACC
        </button>

        <button
          className={sensorType === "gyro" ? "active" : ""}
          onClick={() => setSensorType("gyro")}
        >
          GYRO
        </button>

        <button
          className={sensorType === "mag" ? "active" : ""}
          onClick={() => setSensorType("mag")}
        >
          MAG
        </button>

      </div>

    </div>
  );
}

export default SensorChart;