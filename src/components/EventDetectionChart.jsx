import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function EventDetectionChart({ data }) {
  return (
    <div className="panel event-detection-panel">
      <div className="panel-header">
        <div>
          <h2>HS / TO Detection</h2>
          <p>Filtered gyroscope signal</p>
        </div>
        <div className="chart-legend-label">
          <span className="legend-line" />
          Filtered Gy
        </div>
      </div>

      <div className="analysis-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
            />
            <Line
              type="monotone"
              dataKey="gyro"
              name="Filtered Gy"
              stroke="#4c8dff"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="heelStrike"
              name="Heel Strike (HS)"
              stroke="#ef4444"
              strokeWidth={0}
              dot={{ r: 4, fill: "#ef4444", stroke: "#ef4444" }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="toeOff"
              name="Toe Off (TO)"
              stroke="#22c55e"
              strokeWidth={0}
              dot={{ r: 4, fill: "#22c55e", stroke: "#22c55e" }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EventDetectionChart;
