import {
  mockSensorData,
  mockOrientation,
  mockSession,
  mockEvents,
} from "../data/mockData";

import Header from "../components/Header";
import PrimaryChart from "../components/PrimaryChart";
import SensorChart from "../components/SensorChart";
import OrientationCard from "../components/OrientationCard";
import GaitPhaseChart from "../components/GaitPhaseChart";
import EventCard from "../components/EventCard";
import MetricsBar from "../components/MetricsBar";

function Dashboard() {
  return (
    <div className="dashboard">

      <Header />

      <main className="dashboard-content">

        <section className="primary-section">
          <PrimaryChart data={mockSensorData} />
        </section>

        <section className="dashboard-grid">

          <SensorChart data={mockSensorData} />

          <OrientationCard
            orientation={mockOrientation}
          />

          <GaitPhaseChart
            data={mockSensorData}
          />

          <EventCard
            events={mockEvents}
          />

        </section>

      </main>

      <MetricsBar session={mockSession} />

    </div>
  );
}

export default Dashboard;