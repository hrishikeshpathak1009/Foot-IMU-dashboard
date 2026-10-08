import { Footprints, Gauge, Ruler, Timer, TrendingUp, Activity } from "lucide-react";

const icons = {
  "Heel Strikes": Footprints,
  "Toe Offs": Footprints,
  "Stride Cycles": Activity,
  "Stride Time": Timer,
  Cadence: Gauge,
  "Stride Length": Ruler,
  "Stride Height": TrendingUp,
};

function GaitMetricCard({ label, value, detail, tone = "blue" }) {
  const Icon = icons[label] || Activity;

  return (
    <div className="gait-metric-card">
      <div className={`metric-icon ${tone}`}>
        <Icon size={18} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}

export default GaitMetricCard;
