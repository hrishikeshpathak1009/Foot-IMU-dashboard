
import Papa from "papaparse";

const BASE = `${import.meta.env.BASE_URL}data/trial-001-right/`;

async function loadJSON(filename) {
  const response = await fetch(`${BASE}${filename}`);

  if (!response.ok) {
    throw new Error(`Could not load ${filename}`);
  }

  return response.json();
}

async function loadCSV(filename) {
  const response = await fetch(`${BASE}${filename}`);

  if (!response.ok) {
    throw new Error(`Could not load ${filename}`);
  }

  const csv = await response.text();

  const result = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    throw new Error(
      `CSV parsing failed: ${filename}: ${result.errors[0].message}`
    );
  }

  return result.data;
}

export async function loadTrial001Right() {
  const [
    sensorRows,
    eventRows,
    temporalRows,
    subject,
  ] = await Promise.all([
    loadCSV("trial_001_right.csv"),
    loadCSV("trial_001_right_events.csv"),
    loadCSV("trial_001_right_temporal.csv"),
    loadJSON("subject_info.json"),
  ]);

  return {
    sensorRows,
    eventRows,
    temporalRows,
    subject,
  };
}
