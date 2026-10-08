import { CalendarDays, ChevronDown, Settings, UserRound } from "lucide-react";

function Header() {
  return (
    <header className="topbar">
      <div>
        <h1>Dashboard</h1>
        <p>Complete workflow for IMU-based spatial gait analysis</p>
      </div>

      <div className="topbar-controls">
        <button className="selector">
          <UserRound size={17} />
          <span>
            <strong>Subject 01</strong>
            <small>Right Foot</small>
          </span>
          <ChevronDown size={15} />
        </button>

        <div className="date-display">
          <CalendarDays size={17} />
          <span>
            <strong>May 15, 2025</strong>
            <small>10:24 AM</small>
          </span>
        </div>

        <button className="top-icon-button" aria-label="Settings">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;
