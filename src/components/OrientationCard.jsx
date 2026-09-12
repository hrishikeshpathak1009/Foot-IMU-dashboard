function OrientationCard({ orientation }) {
  return (
    <div className="card orientation-card">

      <div className="card-title">
        ORIENTATION
      </div>

      <div className="card-subtitle">
        Quaternion
      </div>

      <div className="quaternion-grid">

        <div>
          <span>q1</span>
          <strong>{orientation.q1}</strong>
        </div>

        <div>
          <span>q2</span>
          <strong>{orientation.q2}</strong>
        </div>

        <div>
          <span>q3</span>
          <strong>{orientation.q3}</strong>
        </div>

        <div>
          <span>q4</span>
          <strong>{orientation.q4}</strong>
        </div>

      </div>

    </div>
  );
}

export default OrientationCard;