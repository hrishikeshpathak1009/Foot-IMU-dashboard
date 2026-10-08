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

function StrideChart({ data, type }) {
  const isHeight = type === "height";

  return (
    <div className="panel stride-panel">
      <div className="panel-header">
        <div>
          <h2>{isHeight ? "Stride Height" : "Stride Length"}</h2>
          <p>Per-stride analysis</p>
        </div>
      </div>

      <div className="stride-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stride" tick={{ fontSize: 10 }} />
            <YAxis
              tick={{ fontSize: 10 }}
              domain={isHeight ? [0, 20] : [0, 2]}
              unit={isHeight ? " cm" : " m"}
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey={isHeight ? "height" : "length"}
              name="Raw"
              stroke="#9ca3af"
              strokeWidth={1.5}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey={isHeight ? "robustHeight" : "robustLength"}
              name="Robust Estimate"
              stroke="#4c8dff"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footnote">
        <span className="dot-valid" /> Valid
        <span className="dot-rejected" /> Rejected
      </div>
    </div>
  );
}

export default StrideChart;
