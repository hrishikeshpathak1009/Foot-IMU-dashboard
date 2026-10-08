function StatusCard({ icon: Icon, label, value, detail, tone = "blue" }) {
  return (
    <div className="status-card">
      <div className={`status-icon ${tone}`}>
        <Icon size={20} />
      </div>
      <div className="status-content">
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}

export default StatusCard;
