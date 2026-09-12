function MetricsBar({ session }) {
  return (
    <footer className="metrics-bar">

      <div className="metric">
        <span>STEPS</span>
        <strong>{session.steps}</strong>
      </div>

      <div className="metric">
        <span>CADENCE</span>
        <strong>{session.cadence}</strong>
      </div>

      <div className="metric">
        <span>ACTIVITY</span>
        <strong>{session.activity}</strong>
      </div>

      <div className="metric">
        <span>SESSION</span>
        <strong>{session.duration}</strong>
      </div>

      <div className="metric">
        <span>DATA RATE</span>
        <strong>{session.dataRate}</strong>
      </div>

    </footer>
  );
}

export default MetricsBar;