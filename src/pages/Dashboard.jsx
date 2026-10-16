
import { useEffect, useState } from "react";

import {
  loadSubjects,
  loadSubjectTrial,
} from "../services/imuDataService.js";

import {
  processSensorRows,
  processEventDetectionData,
} from "../utils/imuProcessor.js";

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
  mockGaitMetrics,
  mockStrideData,
  mockSession,
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
  const [subjects, setSubjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [trials, setTrials] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [subjectsLoaded, setSubjectsLoaded] = useState(false);

  // Load the available subject list once.
  useEffect(() => {
    let cancelled = false;

    loadSubjects()
      .then((list) => {
        if (cancelled) return;

        setSubjects(list);
        setSelectedIds(list.length ? [list[0].id] : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) {
          setSubjectsLoaded(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Load the data belonging to the selected subjects.
  useEffect(() => {
    if (!subjectsLoaded) return;

    if (selectedIds.length === 0) {
      setTrials([]);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;

    const selectedSubjects = subjects.filter((subject) =>
      selectedIds.includes(subject.id)
    );

    setLoading(true);
    setError("");

    Promise.all(selectedSubjects.map(loadSubjectTrial))
      .then((results) => {
        if (!cancelled) setTrials(results);
      })
      .catch((err) => {
        if (!cancelled) {
          setTrials([]);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subjects, selectedIds, subjectsLoaded]);

  function toggleSubject(id) {
  setSelectedIds([id]);
}

  // The current chart components accept one dataset at a time.
  // Use the first selected subject until chart comparison is implemented.
  const activeTrial = trials[0] ?? null;

  const sensorData = activeTrial
    ? processSensorRows(activeTrial.sensorRows)
    : [];

  const eventData = activeTrial
    ? processEventDetectionData(
        activeTrial.sensorRows,
        activeTrial.eventRows
      )
    : [];

  if (error) {
    return <p role="alert">Failed to load subject data: {error}</p>;
  }

  if (loading) {
    return <p>Loading participant data...</p>;
  }

  if (selectedIds.length === 0) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-shell">
          <Header
            subjects={subjects}
            selectedIds={selectedIds}
            onToggleSubject={toggleSubject}
          />
          <main className="dashboard-content">
            <p>Select at least one participant from the header dropdown.</p>
          </main>
        </div>
      </div>
    );
  }

  if (!activeTrial) {
    return <p>No trial data is available for the selected participant.</p>;
  }

  return (

  
    <div className="app-shell">
      <Sidebar />

      <div className="main-shell">
        <Header
  subjects={subjects}
  selectedIds={selectedIds}
  onToggleSubject={toggleSubject}
/>

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
