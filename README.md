# Foot-IMU Gait Analysis Dashboard

<p align="center">
  <strong>An Interactive Platform for Foot-Mounted IMU Sensor Visualization and Gait Analysis</strong>
  <br />
  <br />
  <a href="https://foot-imu-dashboard.vercel.app/">🚀 Live Demo</a>
</p>

---

## Overview

The **Foot-IMU Gait Analysis Dashboard** is a web-based application designed to visualize, process, and analyze data collected from foot-mounted Inertial Measurement Unit (IMU) sensors.

IMU sensors capture movement-related information such as acceleration and angular velocity. Analyzing these signals can help identify important characteristics of human walking patterns, including gait events and temporal gait parameters.

This project provides an interactive interface that transforms raw sensor readings into meaningful visual representations, making gait-related data easier to explore and interpret.

**Live Application:** [https://foot-imu-dashboard.vercel.app/](https://foot-imu-dashboard.vercel.app/)

## Key Features

### 1. Interactive Dashboard
- Centralized interface for exploring gait-related sensor data.
- Organized visualization of sensor signals and gait parameters.
- Responsive layout for a better user experience.
- Dedicated sections for data visualization and analysis.

### 2. IMU Sensor Data Processing
- Processes raw sensor readings.
- Converts timestamps into relative time values.
- Calculates acceleration magnitude from individual acceleration components.
- Structures sensor data for visualization and further analysis.

### 3. Gait Event Detection
The application supports the visualization of important gait events:

- **Heel Strike (HS):** The point at which the heel makes initial contact with the ground.
- **Toe Off (TO):** The point at which the toe leaves the ground during the walking cycle.

These events help identify different phases of the gait cycle.

### 4. Gait Parameter Visualization
The dashboard presents gait-related parameters to help understand walking patterns and movement characteristics.

### 5. Data Visualization
- Time-series representation of sensor signals.
- Visualization of acceleration patterns.
- Gait event markers on sensor timelines.
- Interactive exploration of processed data.

### 6. Export and AI-Assisted Analysis
The dashboard interface includes facilities for presenting analysis results and exporting reports, helping users interpret and retain gait analysis information.

## Technology Stack

| Technology | Application |
|---|---|
| React.js | Component-based frontend development |
| Vite | Development server and build tooling |
| JavaScript | Application logic and sensor data processing |
| HTML5 | Application structure |
| CSS3 | Styling and responsive interface |
| Vitest | Unit testing |
| Vercel | Frontend deployment |

## Application Architecture

The application follows a modular frontend architecture that separates the user interface from sensor-data processing logic.

```text
Foot-IMU-Dashboard/
│
├── public/
│   └── Static assets
│
├── src/
│   ├── components/
│   │   └── Reusable UI components
│   │
│   ├── pages/
│   │   └── Dashboard pages
│   │
│   ├── utils/
│   │   ├── imuProcessor.js
│   │   └── imuProcessor.test.js
│   │
│   ├── assets/
│   │   └── Images and other assets
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

*Note: The directory structure above is illustrative. Adjust it to match the actual repository.*

## Understanding the Data Processing Pipeline

The dashboard uses sensor-processing utilities to transform raw IMU readings into structured data.

### Step 1: Raw Sensor Input

The application receives sensor readings containing timestamp and movement-related measurements.

Typical accelerometer measurements include:

- Acceleration along the X-axis.
- Acceleration along the Y-axis.
- Acceleration along the Z-axis.

### Step 2: Timestamp Processing

Raw timestamps are converted into relative time values, allowing sensor measurements to be represented on a common timeline.

### Step 3: Acceleration Magnitude

The overall acceleration magnitude is calculated using:

\[
A = \sqrt{a_x^2+a_y^2+a_z^2}
\]

Where:

- \(a_x\) represents X-axis acceleration.
- \(a_y\) represents Y-axis acceleration.
- \(a_z\) represents Z-axis acceleration.

This provides a single value representing the magnitude of acceleration across all three axes.

### Step 4: Gait Event Processing

The processed sensor data is used to represent gait events such as Heel Strike and Toe Off.

These events can be plotted against the sensor timeline to understand the progression of walking cycles.

### Step 5: Visualization

The processed information is presented through interactive charts, event markers, and gait parameter displays.

## Testing

The project uses **Vitest** for unit testing.

The sensor-processing utilities are tested to ensure that raw sensor data is handled correctly.

Current test coverage includes:

| Module | Test Cases |
|---|---|
| `processSensorRows` | Empty sensor input handling |
| `processSensorRows` | Timestamp conversion and acceleration magnitude calculation |
| `processEventDetectionData` | Empty sensor data handling |
| `processEventDetectionData` | Heel Strike and Toe Off event processing |

### Running Tests

```bash
npm install
npm test
```

To run tests in watch mode, if supported by the configured scripts:

```bash
npx vitest
```

## Installation and Local Development

### Prerequisites

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### Navigate to the Project

```bash
cd <PROJECT_DIRECTORY>
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

## Deployment

The application is deployed using **Vercel**.

Access the live application:

<p align="center">
  <a href="https://foot-imu-dashboard.vercel.app/">
    <strong>🌐 Foot-IMU Dashboard — Live Application</strong>
  </a>
</p>

## Future Scope

Potential improvements and extensions include:

- Advanced gait event detection algorithms.
- More comprehensive temporal and spatial gait parameter calculations.
- Support for multiple IMU sensor configurations.
- Real-time sensor data acquisition.
- Comparative gait analysis across multiple recording sessions.
- Enhanced AI-assisted interpretation of gait patterns.
- Exportable reports with detailed visualizations.
- Improved accessibility and mobile responsiveness.

## Learning Outcomes

Working on this project involves exploring several important engineering concepts:

- Processing and interpreting time-series sensor data.
- Understanding IMU measurements and human gait characteristics.
- Developing interactive dashboards using React.
- Designing reusable and modular frontend components.
- Writing and executing unit tests for data-processing utilities.
- Deploying web applications using Vercel.

## Acknowledgements

This project explores the application of wearable inertial sensors and web technologies in human movement analysis.

---

<p align="center">
  <strong>Foot-IMU Gait Analysis Dashboard</strong>
  <br />
  Built with curiosity, engineering, and a focus on understanding human movement.
  <br /><br />
  <a href="https://foot-imu-dashboard.vercel.app/">View Live Project</a>
</p>
