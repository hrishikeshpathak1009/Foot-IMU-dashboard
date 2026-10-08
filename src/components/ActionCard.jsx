function ActionCard({ icon: Icon, label, description, tone = "blue" }) {
  return (
    <button className={`action-card ${tone}`}>
      <Icon size={21} />
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
    </button>
  );
}

export default ActionCard;
