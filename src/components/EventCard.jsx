import { useEffect, useState } from "react";

function EventCard({ events }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simulate event detection for the prototype
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [events.length]);

  const currentEvent = events[currentIndex];

  const getEventClass = (eventType) => {
    switch (eventType) {
      case "HEEL STRIKE":
        return "heel-strike";

      case "FOOT FLAT":
        return "foot-flat";

      case "TOE OFF":
        return "toe-off";

      default:
        return "no-event";
    }
  };

  return (
    <div className="card event-card">

      <div className="card-title">
        DISCRETE EVENTS
      </div>

      <div className="card-subtitle">
        Gait event detection
      </div>

      <div className={`event-display ${getEventClass(currentEvent.type)}`}>

        <div className="event-status">
          ●
        </div>

        <div className="event-name">
          {currentEvent.type}
        </div>

        <div className="event-time">
          {currentEvent.time}
        </div>

      </div>

      <div className="event-history">

        <div className="history-title">
          RECENT EVENTS
        </div>

        {events.map((event, index) => (
          <div
            className={`history-row ${
              index === currentIndex ? "current-event-row" : ""
            }`}
            key={index}
          >
            <span>{event.type}</span>
            <span>{event.time}</span>
          </div>
        ))}

      </div>

    </div>
  );
}

export default EventCard;