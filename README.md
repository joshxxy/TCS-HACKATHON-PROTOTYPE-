# LinePulse Orchestrator

> **Real-Time Shop-Floor Operational Orchestrator for Manufacturing Units**

LinePulse Orchestrator transforms simulated industrial machine events into prioritized downtime-risk issues with role-specific orchestration across Operators, Supervisors, Maintenance Technicians, and Factory Managers.

---

## 🚀 Key Features

- **Live Telemetry Streaming (SSE)**: Simulates 6 industrial workcells (M1–M6) streaming temperature, radial vibration, throughput velocity, pressure, and status codes in real time.
- **Priority-Ranked Issue Queue**: Multi-factor priority scoring algorithm ($0 - 100$) combining downtime risk, order urgency, recurrence, and AI anomaly detection.
- **Role-Based Orchestration**:
  - **Operator (`Op_Ana`)**: Fast, mobile-ready 1-click status transitions (Acknowledge, Start Work, Resolve) and floor observation logging.
  - **Supervisor (`Sup_Marcus`)**: Whole-line bottleneck monitoring, delivery deadline tracking, technician dispatch, and priority score overrides.
  - **Maintenance (`Tech_Ravi`)**: Multi-variable vibration/thermal telemetry, predictive AI root-cause diagnostics, and actionable 4-step remediation checklists.
  - **Factory Manager (`Dr. Linda Chen`)**: Financial downtime risk calculations, MTTA (Mean Time To Acknowledge), and MTTR (Mean Time To Resolve) metrics.
- **AI-Assisted Predictive Reliability**: Transparent AI anomaly assessments and deep diagnostics powered by Google Gemini API with heuristic fallbacks.
- **Demo Controls & Presentation Sandbox**: Built-in interactive controls to pause/resume streams, toggle stress mode, inject test anomalies (Thermal Runaway, Spindle Wear, Pressure Loss, Throughput Jams), and reset to baseline.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, Server-Sent Events (SSE)
- **AI / LLM**: `@google/genai` (Gemini API with fallback heuristic engine)
- **Build & Dev**: Vite, TSX

---

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your optional Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key"
```
*(If no API key is provided, the application automatically runs using the built-in industrial engineering heuristic fallback engine.)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

- `GET /api/machines`: List all 6 workcells and real-time statuses.
- `GET /api/issues`: List prioritized issue queue with role, severity, and status filtering.
- `POST /api/issues/:id/acknowledge`: 1-click operator acknowledgment.
- `POST /api/issues/:id/status`: Update status (`IN_PROGRESS`, `RESOLVED`) with notes.
- `POST /api/issues/:id/assign`: Reassign issue to specific floor technician.
- `POST /api/issues/:id/priority-override`: Supervisor priority adjustment.
- `POST /api/issues/create-manual`: Log manual operator floor observation.
- `POST /api/ai/deep-diagnosis`: Trigger Gemini telemetry root-cause analysis.
- `GET /api/analytics/summary`: MTTA, MTTR, downtime loss, and station incident distributions.
- `GET /api/stream/events`: Real-time Server-Sent Events (SSE) stream.

---

## ⚠️ Disclaimer
All data, machine readings, and AI assessments in this application are simulated for demonstration and operational orchestration prototyping. They are not intended for safety-critical hardware shutdowns.

---

## 📄 License
Apache-2.0
