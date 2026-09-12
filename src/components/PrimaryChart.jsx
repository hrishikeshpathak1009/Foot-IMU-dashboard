import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PrimaryChart({ data }) {
  return (
    <div className="card primary-card">

      <div className="card-header">

        <div>
          <div className="card-title">
            PRIMARY SIGNAL
          </div>

          <div className="card-subtitle">
            Acceleration Magnitude
          </div>
        </div>

        <div className="live-label">
          LIVE ●
        </div>

      </div>

      <div className="chart-container">

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

            <Line
              type="monotone"
              dataKey="acceleration"
              dot={false}
              strokeWidth={2}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default PrimaryChart;