import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function PrimaryChart({ data }) {
  return (
    <div className="panel live-sensor-panel">
      <div className="panel-header">
        <div>
          <h2>Live Sensor Data</h2>
          <p><span className="streaming-dot" /> Streaming...</p>
        </div>
        <div className="chart-meta">Packet Rate: 100 Hz &nbsp;|&nbsp; Samples: 12,540</div>
      </div>

      <div className="chart-section-title">
        <span>Gyroscope (°/s)</span>
        <div className="mini-legend">
          <span><i className="line-red" /> Gyr X</span>
          <span><i className="line-blue" /> Gyr Y</span>
          <span><i className="line-green" /> Gyr Z</span>
        </div>
      </div>

      <div className="sensor-live-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip />
            <Line dataKey="gyroX" name="Gyr X" stroke="#ef4444" dot={false} strokeWidth={1.5} />
            <Line dataKey="gyroY" name="Gyr Y" stroke="#3b82f6" dot={false} strokeWidth={1.8} />
            <Line dataKey="gyroZ" name="Gyr Z" stroke="#22c55e" dot={false} strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section-title acceleration-title">
        <span>Acceleration (m/s²)</span>
        <div className="mini-legend">
          <span><i className="line-red" /> Acc X</span>
          <span><i className="line-blue" /> Acc Y</span>
          <span><i className="line-green" /> Acc Z</span>
        </div>
      </div>

      <div className="sensor-live-chart acceleration-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip />
            <Line dataKey="accX" name="Acc X" stroke="#ef4444" dot={false} strokeWidth={1.5} />
            <Line dataKey="accY" name="Acc Y" stroke="#3b82f6" dot={false} strokeWidth={1.8} />
            <Line dataKey="accZ" name="Acc Z" stroke="#22c55e" dot={false} strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PrimaryChart;
