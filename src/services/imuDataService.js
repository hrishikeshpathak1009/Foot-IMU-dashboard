
import Papa from "papaparse";

const DATA_ROOT = `${import.meta.env.BASE_URL}data/`;

async function loadJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load ${url}: ${response.status}`);
  }

  return response.json();
}

async function loadCSV(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load ${url}: ${response.status}`);
  }

  const csv = await response.text();

  const result = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    dynamicTyping: true,
  });

  if (result.errors.length) {
    throw new Error(
      `CSV parsing failed: ${url}: ${result.errors[0].message}`
    );
  }

  return result.data;
}

export async function loadSubjects() {
  return loadJSON(`${DATA_ROOT}subjects.json`);
}

export async function loadSubjectTrial(subject) {
  // subject.dataPath comes from your local subjects.json manifest.
  const base = `${DATA_ROOT}${subject.dataPath}/`;

  const [sensorRows, eventRows, temporalRows, subjectInfo] =
    await Promise.all([
      loadCSV(`${base}trial_001_right.csv`),
      loadCSV(`${base}trial_001_right_events.csv`),
      loadCSV(`${base}trial_001_right_temporal.csv`),
      loadJSON(`${base}subject_info.json`),
    ]);

  return {
    subject,
    sensorRows,
    eventRows,
    temporalRows,
    subjectInfo,
  };
}
