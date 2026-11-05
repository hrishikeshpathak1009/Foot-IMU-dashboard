
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
  CheckCircle2,
  ClipboardList,
  FolderOpen,
  Play,
  Settings2,
} from "lucide-react";

import { mockTrajectory } from "../data/mockData";

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
  const [lastSubjectId, setLastSubjectId] = useState(null);

  const [trials, setTrials] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [subjectsLoaded, setSubjectsLoaded] = useState(false);

  // 1. Load available subjects once.
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

  // 2. Load trial data for selected subject.
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
        if (!cancelled) {
          setTrials(results);
        }
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

  // 3. Handle subject selection.
  // Remember the previously selected subject.
  function toggleSubject(id) {
    if (id === selectedIds[0]) return;

    setLastSubjectId(selectedIds[0] ?? null);
    setSelectedIds([id]);
  }

  // 4. Get current and previous subjects.
  const selectedSubject = subjects.find(
    (subject) => subject.id === selectedIds[0]
  );

  const lastSubject = subjects.find(
    (subject) => subject.id === lastSubjectId
  );

  // 5. Get active trial and subject information.
  const activeTrial = trials[0] ?? null;

  const subjectInfo = activeTrial?.subjectInfo ?? null;

  // 6. Process sensor and gait data.
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

  // 7. Calculate BMI.
  const bmi =
    subjectInfo?.height_cm > 0 &&
    subjectInfo?.weight_kg > 0
      ? (
          subjectInfo.weight_kg /
          Math.pow(subjectInfo.height_cm / 100, 2)
        ).toFixed(2)
      : null;

      const exportReport = () => {
  const doc = new jsPDF();

  // Report heading
  doc.setFontSize(20);
  doc.setTextColor(16, 36, 63);
  doc.text("Foot-IMU Gait Analysis Report", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  // Subject information
  doc.setFontSize(14);
  doc.setTextColor(16, 36, 63);
  doc.text("Subject Information", 14, 42);

  autoTable(doc, {
    startY: 47,
    theme: "grid",
    head: [["Parameter", "Value"]],
    body: [
      ["Subject", subjectInfo?.subject_name || selectedSubject?.name || selectedIds[0]],
      ["Height", `${subjectInfo?.height_cm ?? "—"} cm`],
      ["Weight", `${subjectInfo?.weight_kg ?? "—"} kg`],
      ["BMI", bmi ?? "—"],
      ["Thigh Length", `${subjectInfo?.segment_length_cm?.thigh ?? "—"} cm`],
      ["Shank Length", `${subjectInfo?.segment_length_cm?.shank ?? "—"} cm`],
      ["Foot Length", `${subjectInfo?.segment_length_cm?.foot ?? "—"} cm`],
    ],
  });

  // Gait parameters
  doc.setFontSize(14);
  doc.setTextColor(16, 36, 63);
  doc.text("Gait Analysis Parameters", 14, doc.lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    theme: "grid",
    head: [["Metric", "Result", "Description"]],
    body: [
      ["Heel Strikes", gaitMetrics.heelStrikes, "Detected contacts"],
      ["Toe Offs", gaitMetrics.toeOffs, "Detected events"],
      ["Stride Cycles", gaitMetrics.strideCycles, "Total cycles"],
      ["Valid Cycles", gaitMetrics.validCycles, "Valid stride cycles"],
      ["Stride Time", `${gaitMetrics.strideTime} s`, "Average stride time"],
      ["Stride Time Std", `${gaitMetrics.strideTimeStd} s`, "Standard deviation"],
      ["Cadence", `${gaitMetrics.cadence} steps/min`, "Steps per minute"],
      ["Stride Length", `${gaitMetrics.strideLength} m`, "Average length"],
      ["Stride Height", `${gaitMetrics.strideHeight} m`, "Average height"],
    ],
  });

  // Save PDF
  const filename = `Gait_Report_${selectedIds[0] || "Subject"}.pdf`;
  doc.save(filename);
};

  // 8. Loading state.
  if (loading) {
    return <p>Loading participant data...</p>;
  }

  // 9. Error state.
  if (error) {
    return (
      <p role="alert">
        Failed to load subject data: {error}
      </p>
    );
  }

  // 10. No subject selected.
  if (selectedIds.length === 0) {
    return (
      <div className="app-shell">
        <div className="main-shell">

          <Header
            subjects={subjects}
            selectedIds={selectedIds}
            onToggleSubject={toggleSubject}
          />

          <main className="dashboard-content">
            <p>
              Select at least one participant from the header dropdown.
            </p>
          </main>

        </div>
      </div>
    );
  }

  // 11. No trial available.
  if (!activeTrial || !gaitMetrics) {
    return (
      <div className="app-shell">
        <div className="main-shell">

          <Header
            subjects={subjects}
            selectedIds={selectedIds}
            onToggleSubject={toggleSubject}
          />

          <main className="dashboard-content">
            <p>
              No trial data is available for the selected participant.
            </p>
          </main>

        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">

      <div className="main-shell">

        <Header
          subjects={subjects}
          selectedIds={selectedIds}
          onToggleSubject={toggleSubject}
        />

        <main className="dashboard-content">

{/* DASHBOARD OVERVIEW */}
<div className="dashboard-overview">

  {/* LEFT: STATUS, ACTIONS AND GAIT METRICS */}
  <div className="dashboard-main">

    {/* STATUS CARDS */}
    <section className="status-grid">

      <StatusCard
        icon={Activity}
        label="Current Subject"
        value={
          subjectInfo?.subject_name ||
          selectedSubject?.name ||
          selectedIds[0]
        }
        detail="Currently selected participant"
        tone="blue"
      />

      <StatusCard
        icon={ClipboardList}
        label="Last Subject"
        value={lastSubject?.name || lastSubjectId || "None"}
        detail={
          lastSubjectId
            ? "Previously selected participant"
            : "No previous selection"
        }
        tone="blue"
      />

    </section>

    {/* ACTION CARDS */}
    <section className="actions-grid">

      {/* <ActionCard
        icon={Settings2}
        label="Start Calibration"
        description="5s standing + 20s walking"
        tone="green"
      /> */}

      <ActionCard
  icon={FileText}
  label="Export Report"
  description="Download gait analysis PDF"
  tone="green"
  onClick={exportReport}
/>

      <ActionCard
        icon={Activity}
        label="AI Analysis"
        description="Perform your Analysis using AI"
        tone="purple"
        onClick={() =>
          window.open(
            "https://foot-imu-analysis-ihzfwmear-manans-projects-4c50ea69.vercel.app/",
            "_blank",
            "noopener,noreferrer"
          )
        }
      />

      {/* <ActionCard
        icon={FolderOpen}
        label="View Results"
        description="Open trial history"
        tone="white"
      /> */}

    </section>

    {/* GAIT METRICS */}
    <section className="metrics-analysis">
      <div className="gait-metrics-grid">

        <GaitMetricCard
          label="Heel Strikes"
          value={gaitMetrics.heelStrikes}
          detail="Detected contacts"
          tone="blue"
        />

        <GaitMetricCard
          label="Toe Offs"
          value={gaitMetrics.toeOffs}
          detail="Detected events"
          tone="purple"
        />

        <GaitMetricCard
          label="Stride Cycles"
          value={gaitMetrics.strideCycles}
          detail={`${gaitMetrics.validCycles} valid cycles`}
          tone="green"
        />

        <GaitMetricCard
          label="Stride Time"
          value={`${gaitMetrics.strideTime} s`}
          detail={`± ${gaitMetrics.strideTimeStd} s`}
          tone="orange"
        />

        <GaitMetricCard
          label="Cadence"
          value={gaitMetrics.cadence}
          detail="Steps/min"
          tone="blue"
        />

        <GaitMetricCard
          label="Stride Length"
          value={`${gaitMetrics.strideLength} m`}
          detail="Average length"
          tone="green"
        />

        <GaitMetricCard
          label="Stride Height"
          value={`${gaitMetrics.strideHeight} m`}
          detail="Average height"
          tone="purple"
        />

      </div>
    </section>

  </div>

  {/* RIGHT: SUBJECT PROFILE */}
  <aside className="profile-sidebar">

    <div className="compact-profile">

      <div className="compact-profile-header">
        <div>
          <h3>Subject Profile</h3>
          <span>Participant information</span>
        </div>
        <Activity size={19} />
      </div>

      {subjectInfo ? (
        <>
          <div className="compact-subject-name">
            {subjectInfo.subject_name || "Unknown Subject"}
          </div>

          <div className="compact-profile-stats">

            <div>
              <span>Height</span>
              <strong>
                {subjectInfo.height_cm ?? "—"} <small>cm</small>
              </strong>
            </div>

            <div>
              <span>Weight</span>
              <strong>
                {subjectInfo.weight_kg ?? "—"} <small>kg</small>
              </strong>
            </div>

            <div>
              <span>BMI</span>
              <strong>{bmi ?? "—"}</strong>
            </div>

          </div>

          <div className="compact-segments">
            <span>SEGMENT LENGTHS</span>

            <div>
              <label>Thigh</label>
              <strong>
                {subjectInfo.segment_length_cm?.thigh ?? "—"} cm
              </strong>
            </div>

            <div>
              <label>Shank</label>
              <strong>
                {subjectInfo.segment_length_cm?.shank ?? "—"} cm
              </strong>
            </div>

            <div>
              <label>Foot</label>
              <strong>
                {subjectInfo.segment_length_cm?.foot ?? "—"} cm
              </strong>
            </div>

          </div>
        </>
      ) : (
        <p className="compact-profile-empty">
          Subject information unavailable.
        </p>
      )}

    </div>
  </aside>

</div>

          {/* 5. SENSOR AND EVENT DETECTION GRAPHS */}

          <section className="analysis-top-grid">

            <PrimaryChart data={sensorData} />

            <EventDetectionChart data={eventData} />

          </section>


          {/* 6. DETAILED STRIDE ANALYSIS */}

          <section className="lower-analysis-grid">

            <StrideChart
              data={strideData}
              type="height"
            />

            <StrideChart
              data={strideData}
              type="length"
            />

            <FootTrajectory
              data={mockTrajectory}
            />

          </section>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;
