
function SubjectSelector({
  subjects,
  selectedIds,
  onToggle,
}) {
  return (
    <div className="subject-selector">
      <h3>Select Participants</h3>

      {subjects.map((subject) => (
        <label key={subject.id} className="subject-option">
          <input
            type="checkbox"
            checked={selectedIds.includes(subject.id)}
            onChange={() => onToggle(subject.id)}
          />

          <span>{subject.name}</span>
        </label>
      ))}
    </div>
  );
}

export default SubjectSelector;
