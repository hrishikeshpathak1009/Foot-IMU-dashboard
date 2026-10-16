
import { useEffect, useState } from "react";

import {
  loadSubjects,
  loadSubjectTrial,
} from "../services/imuDataService.js";

import {
  processSensorRows,
  processEventDetectionData,
  processGaitMetrics,
  processStrideRows,
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
    const gaitMetrics = activeTrial
  ? processGaitMetrics(
      activeTrial.temporalRows,
      activeTrial.eventRows
    )
  : null;

const strideData = activeTrial
  ? processStrideRows(activeTrial.temporalRows)
  : [];
  console.log("Selected subject:", activeTrial?.subject);
console.log("Temporal rows:", activeTrial?.temporalRows);
console.log(
  "Temporal columns:",
  Object.keys(activeTrial?.temporalRows?.[0] ?? {})
);
console.log("Processed stride data:", strideData);

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
  value={gaitMetrics.heelStrikes}
  detail="Detected events"
  tone="red"
/>

<GaitMetricCard
  label="Toe Offs"
  value={gaitMetrics.toeOffs}
  detail="Detected events"
  tone="green"
/>

<GaitMetricCard
  label="Stride Cycles"
  value={gaitMetrics.strideCycles}
  detail={`Valid cycles: ${gaitMetrics.validCycles}`}
  tone="orange"
/>

<GaitMetricCard
  label="Stride Time"
  value={
    gaitMetrics.strideTime === null
      ? "—"
      : `${gaitMetrics.strideTime} s`
  }
  detail={
    gaitMetrics.strideTimeStd === null
      ? "Standard deviation unavailable"
      : `± ${gaitMetrics.strideTimeStd} s`
  }
  tone="purple"
/>

<GaitMetricCard
  label="Cadence"
  value={
    gaitMetrics.cadence === null
      ? "—"
      : `${gaitMetrics.cadence} steps/min`
  }
  detail={
    gaitMetrics.cadenceStd === null
      ? "Standard deviation unavailable"
      : `± ${gaitMetrics.cadenceStd} steps/min`
  }
  tone="blue"
/>

<GaitMetricCard
  label="Stride Length"
  value={
    gaitMetrics.strideLength === null
      ? "—"
      : `${gaitMetrics.strideLength} m`
  }
  detail={
    gaitMetrics.strideLengthStd === null
      ? "Standard deviation unavailable"
      : `± ${gaitMetrics.strideLengthStd} m`
  }
  tone="green"
/>

<GaitMetricCard
  label="Stride Height"
  value={
    gaitMetrics.strideHeight === null
      ? "—"
      : `${(gaitMetrics.strideHeight * 100).toFixed(1)} cm`
  }
  detail={
    gaitMetrics.strideHeightStd === null
      ? "Standard deviation unavailable"
      : `± ${(gaitMetrics.strideHeightStd * 100).toFixed(1)} cm`
  }
  tone="orange"
/>

            </div>
          </section>

          <section className="lower-analysis-grid">
            <StrideChart data={strideData} type="height" />
<StrideChart data={strideData} type="length" />
            <FootTrajectory data={mockTrajectory} />
          </section>

         
        </main>
      </div>
    </div>
  );
}

  


export default Dashboard;
