
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Settings,
  UserRound,
  Check,
} from "lucide-react";

function Header({
  subjects = [],
  selectedIds = [],
  onToggleSubject = () => {},
}) {
  const [now, setNow] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const selectedSubjects = subjects.filter((subject) =>
    selectedIds.includes(subject.id)
  );

  const dateText = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeText = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const subjectLabel =
    selectedSubjects.length === 0
      ? "Select Subject"
      : selectedSubjects.length === 1
        ? selectedSubjects[0].name
        : `${selectedSubjects.length} Subjects Selected`;

  return (
    <header className="topbar">
      <div>
        <h1>Dashboard</h1>
        <p>Complete workflow for IMU-based spatial gait analysis</p>
      </div>

      <div className="topbar-controls">
        <div className="subject-dropdown">
          <button
            type="button"
            className="selector"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <UserRound size={17} />

            <span>
              <strong>{subjectLabel}</strong>
              <small>
                {selectedSubjects.length === 1
                  ? "Right Foot"
                  : "Participant comparison"}
              </small>
            </span>

            <ChevronDown
              size={15}
              className={dropdownOpen ? "chevron-open" : ""}
            />
          </button>

          {dropdownOpen && (
            <div className="subject-menu">
              <div className="subject-menu-header">
                <strong>Select participant</strong>
                
              </div>

              {subjects.length === 0 ? (
                <p className="subject-empty">
                  No participants available.
                </p>
              ) : (
                subjects.map((subject) => {
                  const selected = selectedIds.includes(subject.id);

                  return (
                    <button
                      type="button"
                      key={subject.id}
                      className={`subject-menu-item ${
                        selected ? "selected" : ""
                      }`}
                      onClick={() => onToggleSubject(subject.id)}
                    >
                      <span className="subject-check">
                        {selected && <Check size={14} />}
                      </span>

                      <span className="subject-menu-label">
                        <strong>{subject.name}</strong>
                        <small>Right Foot</small>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="date-display">
          <CalendarDays size={17} />
          <span>
            <strong>{dateText}</strong>
            <small>{timeText}</small>
          </span>
        </div>

        <button
          type="button"
          className="top-icon-button"
          aria-label="Settings"
          onClick={() => onToggleSubject(subject.id)}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;
