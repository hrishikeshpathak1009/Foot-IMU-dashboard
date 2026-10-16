
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

function StrideChart({ data = [], type }) {
  const isHeight = type === "height";
  const rawKey = isHeight ? "height" : "length";
  const estimateKey = isHeight ? "robustHeight" : "robustLength";

  const hasData = data.some(
    (row) => row[rawKey] !== null && row[rawKey] !== undefined
  );

  return (
    <div className="panel stride-panel">
      <div className="panel-header">
        <div>
          <h2>{isHeight ? "Stride Height" : "Stride Length"}</h2>
          <p>Per-stride analysis</p>
        </div>
      </div>

      <div className="stride-chart">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="stride"
                tick={{ fontSize: 10 }}
                label={{
                  value: "Stride",
                  position: "insideBottom",
                  offset: -3,
                  fontSize: 10,
                }}
              />

              <YAxis
                tick={{ fontSize: 10 }}
                domain={isHeight ? [0, 20] : [0, 2]}
                unit={isHeight ? " cm" : " m"}
              />

              <Tooltip
                formatter={(value, name) => [
                  value == null
                    ? "—"
                    : `${Number(value).toFixed(2)} ${
                        isHeight ? "cm" : "m"
                      }`,
                  name,
                ]}
                labelFormatter={(label) => `Stride ${label}`}
              />

              <Legend wrapperStyle={{ fontSize: 10 }} />

              <Line
                type="monotone"
                dataKey={rawKey}
                name="Raw"
                stroke="#9ca3af"
                strokeWidth={1.5}
                connectNulls={false}
                dot={(props) => {
                  const point = data[props.index];

                  if (!point || props.cx == null || props.cy == null) {
                    return null;
                  }

                  const rejected = !point.valid;

                  return (
                    <circle
                      key={`point-${props.index}`}
                      cx={props.cx}
                      cy={props.cy}
                      r={3}
                      fill={rejected ? "#ef4444" : "#4c8dff"}
                      stroke={rejected ? "#ef4444" : "#4c8dff"}
                    />
                  );
                }}
              />

              {data.some((row) => row[estimateKey] != null) && (
                <Line
                  type="monotone"
                  dataKey={estimateKey}
                  name="Robust Estimate"
                  stroke="#4c8dff"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="chart-empty">
            No {isHeight ? "stride-height" : "stride-length"} data available
            for this subject.
          </p>
        )}
      </div>

      <div className="chart-footnote">
        <span className="dot-valid" /> Valid
        <span className="dot-rejected" /> Rejected
      </div>
    </div>
  );
}

export default StrideChart;
