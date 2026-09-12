import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function GaitPhaseChart({ data }) {
  return (
    <div className="card">

      <div className="card-title">
        GAIT PHASE
      </div>

      <div className="card-subtitle">
        Cyclic phase signal
      </div>

      <div className="chart-container">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis domain={[0, 1]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="gaitPhase"
              dot={false}
              strokeWidth={2}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default GaitPhaseChart;