function ActionCard({
  icon: Icon,
  label,
  description,
  tone = "blue",
  onClick,
}) {
  return (
    <button
      className={`action-card ${tone}`}
      onClick={onClick}
      type="button"
    >
      <Icon size={21} />
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
    </button>
  );
}

export default ActionCard;