import { Wifi, Settings } from "lucide-react";

function Header() {
  return (
    <header className="header">

      <div className="brand">
        <div className="brand-title">
          FOOT IMU
        </div>

        <div className="brand-subtitle">
          Real-time gait monitoring
        </div>
      </div>

      <div className="connection-area">

        <div className="connection-status">
          <span className="status-dot"></span>
          <span>LIVE</span>
        </div>

        <div className="connection-method">
          <Wifi size={16} />
          BLE
        </div>

        <button className="icon-button">
          <Settings size={19} />
        </button>

      </div>

    </header>
  );
}

export default Header;