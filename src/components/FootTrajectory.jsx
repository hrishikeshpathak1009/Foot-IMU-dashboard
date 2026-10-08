function FootTrajectory({ data }) {
  const width = 360;
  const height = 210;
  const pad = 28;

  const points = data.map((p) => {
    const x = pad + (p.x / 10) * (width - pad * 2);
    const y = height - pad - ((p.z + 0.03) / 0.25) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <div className="panel trajectory-panel">
      <div className="panel-header">
        <div>
          <h2>3D Foot Trajectory</h2>
          <p>World frame</p>
        </div>
      </div>

      <div className="trajectory-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Foot trajectory">
          <defs>
            <linearGradient id="trajectoryGrid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dbe5f4" />
              <stop offset="100%" stopColor="#eef2f7" />
            </linearGradient>
          </defs>

          <path d={`M${pad},${height-pad} L${width-pad},${height-pad}`} className="axis-line" />
          <path d={`M${pad},${height-pad} L${pad},${pad}`} className="axis-line" />
          <path d={`M${pad},${height-pad} L${pad+45},${height-pad-28}`} className="axis-line" />

          {[0, 1, 2, 3, 4].map((i) => {
            const y = pad + i * ((height - pad * 2) / 4);
            return <line key={i} x1={pad} y1={y} x2={width-pad} y2={y} className="grid-line" />;
          })}

          <polyline points={points} fill="none" className="trajectory-line" />

          {data.filter((_, i) => i % 8 === 0).map((p, i) => {
            const x = pad + (p.x / 10) * (width - pad * 2);
            const y = height - pad - ((p.z + 0.03) / 0.25) * (height - pad * 2);
            return <circle key={i} cx={x} cy={y} r="2.4" className="trajectory-point" />;
          })}

          <text x={width - 18} y={height - 8} className="axis-label">X (m)</text>
          <text x={pad + 5} y={pad - 8} className="axis-label">Z (m)</text>
          <text x={pad + 48} y={height - pad - 31} className="axis-label">Y</text>
        </svg>
      </div>
    </div>
  );
}

export default FootTrajectory;
