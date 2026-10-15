import { useEffect, useState } from "react";
import { loadTrial001Right } from "../services/imuDataService.js";
import {
  processSensorRows,
  processEventDetectionData,
} from "../utils/imuProcessor";


import {
  Activity,
  Bluetooth,
  CheckCircle2,
  ClipboardList,
  FolderOpen,
  Play,
  Settings2,
} from "lucide-react";

import {
  mockEventDetectionData,
  mockGaitMetrics,
  mockSensorData,
  mockSession,
  mockStrideData,
  mockTrajectory,
} from "../data/mockData";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusCard from "../components/StatusCard";
import ActionCard from "../components/ActionCard";
import PrimaryChart from "../components/PrimaryChart";
import EventDetectionChart from "../components/EventDetectionChart";
import GaitMetricCard from "../components/GaitMetricCard";
import StrideChart from "../components/StrideChart";
import FootTrajectory from "../components/FootTrajectory";

function Dashboard() {
  

  const [trialData, setTrialData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrial001Right()
      .then(setTrialData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p>Failed to load trial: {error}</p>;
  }

  if (!trialData) {
    return <p>Loading trial data...</p>;
  }

  const sensorData = processSensorRows(trialData.sensorRows);

const eventData = processEventDetectionData(
  trialData.sensorRows,
  trialData.eventRows
);
console.table(
  eventData
    .filter(
      (point) =>
        point.heelStrike !== null ||
        point.toeOff !== null
    )
    .map((point) => ({
      time: point.time,
      heelStrike: point.heelStrike,
      toeOff: point.toeOff,
    }))
);

  // Add the console.log statements here
  console.log("Sensor rows:", trialData.sensorRows.length);
  console.log("First raw row:", trialData.sensorRows[0]);
  console.log("First processed row:", sensorData[0]);
  console.log("Events:", trialData.eventRows.length);
  console.log("Temporal rows:", trialData.temporalRows.length);

 return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-shell">
        <Header />

        <main className="dashboard-content">
          <section className="status-grid">
            <StatusCard
              icon={Bluetooth}
              label="Sensor Status"
              value="Connected"
              detail="RYMO IMU  •  Battery 78%"
              tone="blue"
            />
            <StatusCard
              icon={Activity}
              label="Current Subject"
              value="Subject 01"
              detail="Right Foot"
              tone="blue"
            />
            <StatusCard
              icon={ClipboardList}
              label="Last Trial"
              value="trial_001_right.csv"
              detail="Duration: 25.3 s"
              tone="blue"
            />
            <StatusCard
              icon={CheckCircle2}
              label="Calibration Status"
              value="Completed"
              detail="May 15, 2025 10:12 AM"
              tone="green"
            />
          </section>

          <section className="actions-grid">
            <ActionCard icon={Settings2} label="Start Calibration" description="5s standing + 20s walking" tone="green" />
            <ActionCard icon={Play} label="Start Recording" description="Record 25s trial" tone="blue" />
            <ActionCard icon={Activity} label="Analyze Trial" description="Process gait parameters" tone="purple" />
            <ActionCard icon={FolderOpen} label="View Results" description="Open trial history" tone="white" />
          </section>

          <section className="analysis-top-grid">
  <PrimaryChart data={sensorData} />
  <EventDetectionChart data={eventData} />
</section>

          <section className="metrics-analysis">
            <div className="gait-metrics-grid">
              <GaitMetricCard
                label="Heel Strikes"
                value={mockGaitMetrics.heelStrikes}
                detail="Avg interval: 1.21 s"
                tone="red"
              />
              <GaitMetricCard
                label="Toe Offs"
                value={mockGaitMetrics.toeOffs}
                detail="Avg interval: 1.20 s"
                tone="green"
              />
              <GaitMetricCard
                label="Stride Cycles"
                value={mockGaitMetrics.strideCycles}
                detail={`Valid cycles: ${mockGaitMetrics.validCycles} (91%)`}
                tone="orange"
              />
              <GaitMetricCard
                label="Stride Time"
                value={`${mockGaitMetrics.strideTime} s`}
                detail={`± ${mockGaitMetrics.strideTimeStd} s`}
                tone="purple"
              />
              <GaitMetricCard
                label="Cadence"
                value={`${mockGaitMetrics.cadence} steps/min`}
                detail={`± ${mockGaitMetrics.cadenceStd} steps/min`}
                tone="blue"
              />
              <GaitMetricCard
                label="Stride Length"
                value={`${mockGaitMetrics.strideLength} m`}
                detail={`± ${mockGaitMetrics.strideLengthStd} m`}
                tone="green"
              />
              <GaitMetricCard
                label="Stride Height"
                value={`${mockGaitMetrics.strideHeight} cm`}
                detail={`± ${mockGaitMetrics.strideHeightStd} cm`}
                tone="orange"
              />
            </div>
          </section>

          <section className="lower-analysis-grid">
            <StrideChart data={mockStrideData} type="height" />
            <StrideChart data={mockStrideData} type="length" />
            <FootTrajectory data={mockTrajectory} />
          </section>

          <section className="legacy-summary">
            <div>
              <span>SESSION</span>
              <strong>{mockSession.duration}</strong>
            </div>
            <div>
              <span>STEPS</span>
              <strong>{mockSession.steps}</strong>
            </div>
            <div>
              <span>ACTIVITY</span>
              <strong>{mockSession.activity}</strong>
            </div>
            <div>
              <span>DATA RATE</span>
              <strong>{mockSession.dataRate}</strong>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

  


export default Dashboard;
