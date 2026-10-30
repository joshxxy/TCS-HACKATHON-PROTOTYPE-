# LinePulse Orchestrator – Build Plan (Hackathon-Ready)

---

## 1. Problem Statement

In many small and medium manufacturing units, “digitalization” has produced static dashboards and periodic reports rather than real-time, operator-centered tools. Current systems typically:

- Show **historical metrics** (hourly/daily reports) instead of live, actionable issues.
- Are owned by **IT or BI/reporting teams**, not by the people running the line day-to-day.
- Lack a **unified event model** that ties machine readings, orders, and roles (operator vs supervisor vs maintenance) into a single “source of truth.”
- Don’t provide **prioritized, role-specific alerts**—leaving operators to notice problems manually or via basic alarms.
- Rarely use AI in a **transparent** way to flag unusual patterns or suggest actions.

As a result:

- Operators are reactive: they discover issues after they become serious downtime events.
- Supervisors and maintenance teams **don’t share a single live view** of what’s happening.
- Decisions are made based on **gut feel**, not a shared, prioritized issue queue.
- There’s no simple way to **acknowledge, assign, and track** responses to issues.

**Root cause**: Dashboards are treated as backward-looking reporting artifacts, not as a **real-time product** that orchestrates people and machines around live events.

---

## 2. Solution Overview

**LinePulse Orchestrator** is a simple, modern, web-first app (responsive, mobile-friendly) that:

- Streams **simulated machine events** (temperature, vibration, throughput, error codes, etc.) in real-time.
- Converts these events into **prioritized “issue cards”** ranked by downtime risk, order urgency, and severity.
- Shares **one live view** of the line for operators, supervisors, and maintenance, with:
  - A **live machine monitoring dashboard**,
  - A **priority-based issue queue** with AI-assisted risk scoring,
  - **Smart alerts** plus recommended actions,
  - A **simple acknowledgement and response tracking** system.
- Uses **AI on simulated data** to:
  - Detect unusual readings (“anomaly-like”) and potential maintenance risks,
  - Estimate potential downtime costs (rough, clearly labeled estimates),
  - Suggest likely root causes and recommended next steps.

All data and AI insights are clearly labeled as **simulated or estimated**, not real industrial measurements or validated predictions. The system is a **demonstration concept** that can be shown easily on a laptop or phone during the hackathon.

---

## 3. Target Users

### 3.1 Factory Managers
- Need a quick understanding of:
  - Which machines are currently at risk,
  - How often issues occur,
  - Estimated impact on throughput and downtime.
- Want **simple analytics over time** to guide investment and process decisions.

### 3.2 Production Supervisors / Line Leaders
- Need a **live view of their line**:
  - Which machines are down, at risk, or trending badly.
  - Which orders may be delayed.
- Need a **single, prioritized issue queue** across all machines.
- Need to see **who is working on what** and avoid duplicated work.

### 3.3 Machine Operators
- Need a **clear, minimal, mobile-friendly screen**:
  - See current issues affecting their machine(s),
  - Get **clear alerts** and recommended actions,
  - Quickly **acknowledge** and **update** status (started fix, waiting on parts, resolved).

### 3.4 Maintenance Technicians
- Need to see issues related to:
  - Machine health (vibration, temperature, error codes),
  - AI-flagged **predictive maintenance risks**.
- Need clear assignment, recommended checks, and logging of work done.

---

## 4. Key Features

> All features below must be implemented at least in a basic, hackathon-ready form.

### 4.1 Real-time Event Streaming (Simulated)

- Simulate 3–6 machines (e.g., M1–M6) emitting:
  - Temperature, vibration, throughput, error code, and operating state.
- Emit data every 1–5 seconds per machine.
- Stream to the front-end so charts and issue lists **update live**.
- Implementation:
  - Simple backend timer (setInterval / cron-like loop) pushing events into:
    - WebSocket or Server-Sent Events (SSE) channel, and/or
    - In-memory store for querying.
  - Ability to **start/stop simulation** from an admin or demo control.

### 4.2 Issue Queue with Priority Ranking

- Convert raw events into normalized **Issue objects**:
  - machineId, type, severity, status, createdAt, lastUpdatedAt, priorityScore, assignedRole, assignedUser, recommendedActions, estimatedDowntimeMinutes, isAiEstimated, isSimulated.
- Define a **priority scoring function** using:
  - Downtime risk (machine offline, critical parameter exceedance),
  - Order urgency (e.g., simulated “High priority order on M1”),
  - Historical pattern (repeated issues on same machine in short window),
  - AI anomaly score (unusual reading => higher priority).
- Display as a **live issue queue**:
  - Sorted by priorityScore (highest first),
  - Color-coded by severity (Critical, High, Medium, Low),
  - Filterable by machine, role, and status (Open, Acknowledged, In Progress, Resolved).

### 4.3 Role-based Notification System

- Configure simple roles: **Operator, Supervisor, Maintenance, Manager**.
- Each issue has:
  - `primaryRole` (who should see it first),
  - `secondaryRoles` (other roles notified).
- When new issues are created or severity/priority changes:
  - Show inline notifications (toasts, badge counters),
  - Highlight relevant issues per role view.
- Basic routing rules:
  - **Operator** – local alarms (minor deviations, throughput dips).
  - **Supervisor** – line-wide issues, major downtime risk, high-priority orders.
  - **Maintenance** – health-related issues (vibration, temperature, error codes, anomalies).
  - **Manager** – only critical issues + analytics view (summary).

### 4.4 Simple Acknowledgment and Response Tracking

- Each issue has a **status workflow**:
  - Open → Acknowledged → In Progress → Resolved → (optionally) Closed.
- Actions:
  - Any logged-in user can **acknowledge** an issue:
    - Capture who, when, and (optional) note.
  - Users can update status (In Progress, Resolved) and add comments.
  - Show **activity timeline** on issue detail:
    - Status changes, comments, recommended actions taken.
- Display assignment:
  - “Currently handled by: [User / Role]”
  - For hackathon: mock users like “Op_Ana”, “Tech_Ravi” with simple select dropdowns.

### 4.5 Mobile-Friendly Interface

- Fully responsive layout using a modern UI library (e.g., Tailwind + React component library).
- Key views optimized for **phone usage**:
  - Collapsible sidebar,
  - Single-column card layouts on narrow screens,
  - Large tap targets for buttons (Acknowledge, Update, Resolve).
- Offline/low-latency awareness not required, but UI should:
  - Show **connection status** for the live stream (e.g., “Live •” or “Reconnecting…”),
  - Handle reconnection gracefully.

### 4.6 Basic Analytics Dashboard

- Simple **Analytics** page with:
  - Issues over time (bar/line chart: count per hour/day).
  - Issues by machine (bar chart).
  - Issues by severity (pie or bar).
  - Mean Time To Acknowledge (MTTA) and Mean Time To Resolve (MTTR) – based on tracked timestamps.
  - Total **estimated downtime minutes** (from AI/heuristic estimation), clearly labeled as **estimated**.
- Time filters: last 1h, 24h, 7d (simulated/time-compressed if desired).

### 4.7 AI-Powered Predictive Maintenance & Smart Alerts

> This is AI on **simulated data**; label all outputs with “Simulated AI estimate – not for real-world use.”

- **Anomaly / Unusual Reading Detection**:
  - Simple model:
    - Baseline ranges or rolling mean/stddev per machine & metric,
    - Flag if reading deviates beyond threshold (e.g., 3σ).
  - Or use a lightweight ML/anomaly library if available, but heuristics are fine.
- **Predictive Maintenance Risk Scoring**:
  - Combine:
    - Recent anomalies,
    - Frequency of issues on that machine,
    - Time since last “maintenance” (simulated).
  - Output a **risk level** (Low/Medium/High) plus a numeric riskScore.
- **Smart Alerts & Recommendations**:
  - For high risk, generate:
    - “Potential bearing wear – check lubrication and listen for abnormal noise.”
    - “Temperature trending upward – check cooling system and airflow.”
  - Use a simple rule-engine or LLM prompt (if allowed) to:
    - Map patterns (temp up, vibration up, throughput down) to suggested causes/actions.
  - Show on issue details:
    - “AI Suggests: [Suggested root cause]”
    - “Recommended Actions: [Step 1, Step 2, Step 3]”
- **Downtime Cost Estimation**:
  - For each issue, estimate:
    - `estimatedDowntimeMinutes` (heuristic),
    - `estimatedCost` = `estimatedDowntimeMinutes` × `simulatedCostPerMinute`.
  - Show in UI with clear label: “Estimated downtime cost (simulated): $X”.

---

## 5. User Flow

### 5.1 Onboarding & Login

1. User opens the web app on desktop or mobile.
2. Simple login or role-selector:
   - Either: username/password with role stored,
   - Or: quick hackathon dropdown – choose role (Operator, Supervisor, Maintenance, Manager) and demo user name.
3. Based on role, user is redirected to their default view:
   - Operator/Maintenance → **Live Monitor / Issue Queue**.
   - Supervisor → **Line Overview / Issue Queue**.
   - Manager → **Analytics Dashboard**.

### 5.2 Real-time Monitoring

1. Backend simulation starts (or is already running), sending events.
2. User sees:
   - **Top bar**: current line status summary (e.g., 5 machines OK, 1 Warning).
   - **Live Machine Monitoring Dashboard**:
     - Cards for each machine:
       - Machine name (M1, M2, …),
       - Current status (OK, Warning, Down),
       - Key metrics (temp, vibration, throughput) with small sparkline charts,
       - AI risk tag (Low/Medium/High – clearly labeled “Simulated AI risk”).
3. As events stream, metrics and risk badges update.

### 5.3 Issue Creation & Prioritization

1. Simulation sends an out-of-bound reading or error code.
2. Backend event engine:
   - Checks thresholds and anomaly rules,
   - Creates/updates an Issue for that machine.
3. Priority engine computes `priorityScore` based on:
   - Severity (e.g., machine down > minor deviation),
   - Simulated order urgency,
   - AI riskLevel,
   - Recurrence of similar issues.
4. Issue appears in the **Issue Queue**:
   - Card shows:
     - Machine, issue type, severity, created time, priority badge,
     - Estimated downtime & cost (labeled “simulated estimate”),
     - AI recommendations snippet (“AI suggests: Possible overheating due to blocked filter…”).

### 5.4 Notifications & Role Views

1. If the issue is relevant to user’s role:
   - A **notification badge** increments,
   - Optional toast: “New critical issue on M3 (Overheat) – Assigned to Maintenance.”
2. Users can filter the queue by:
   - “My role only” or “All issues”.
3. Supervisors see a **consolidated view**, allowing them to:
   - Re-assign issues to specific users/roles,
   - Adjust priorities (for demo, a manual override field).

### 5.5 Acknowledgment & Response

1. Operator taps/clicks an issue card to open detail view:
   - Overview: machine state, metrics history (last 5–10 minutes),
   - AI risk assessment, estimated downtime, recommended actions,
   - Event timeline and comments.
2. Operator clicks “Acknowledge”:
   - Status changes to Acknowledged,
   - System logs user, timestamp.
3. Operator selects status “In Progress” and optionally adds a note:
   - e.g., “Checking coolant,” “Power-cycled machine.”
4. Once addressed, operator (or maintenance) sets status to “Resolved”:
   - May add final note: “Replaced fan; temp back to normal.”
5. All these updates appear in the issue’s activity log and contribute to MTTA/MTTR metrics.

### 5.6 Analytics & Review

1. Manager or Supervisor opens **Analytics Dashboard**:
   - Sees charts for:
     - Issue counts over time,
     - Most problematic machines,
     - Distribution by severity,
     - AI risk distribution and how often risk=High correlated with issues.
2. They can:
   - Filter by machine, severity, time range,
   - Review simulated downtime cost estimates.
3. During demo, students can:
   - Trigger “stress mode” in simulation (more frequent anomalies),
   - Show how issue volume and analytics respond.

---

## 6. Technical Approach

This section is written so a prototyping tool (Lovable, Bolt, etc.) can auto-generate scaffolding.

### 6.1 Overall Architecture

- **Frontend**: SPA (Single Page Application) – React recommended.
- **Backend**: Lightweight Node.js/Express or Python/FastAPI.
- **Data Transport**:
  - WebSockets or Server-Sent Events (SSE) for live event/issue updates.
- **Persistence** (for analytics and history):
  - Simple relational DB (SQLite, PostgreSQL) or in-memory + JSON files for demo.
- **AI/Logic**:
  - Rule-based anomaly detection and risk scoring implemented in backend.
  - Optional: integrate a hosted LLM (if allowed) for natural language recommendations.

### 6.2 Frontend Implementation

**Suggested stack:**
- React + Vite or Next.js.
- Tailwind CSS or Chakra UI / Mantine for fast, modern UI.
- Chart library: Recharts, Chart.js, or ECharts.
- State management: React Query / SWR for data fetching + local state for UI.

**Core pages/components:**

1. **Auth / Role Selection Page**
   - Simple form:
     - Name
     - Role selector (Operator, Supervisor, Maintenance, Manager).
   - Store in localStorage for quick re-login.

2. **Layout**
   - Top nav:
     - App name, role, user, connection status (“Live •”, “Reconnecting…”).
   - Left sidebar (collapsible on mobile):
     - Nav items: Dashboard, Issues, Analytics, (optional) Simulation Controls.
   - Main content responsive grid.

3. **Live Machine Monitoring Dashboard**
   - Grid of MachineCards:
     - Machine name + status pill (OK / Warning / Down),
     - Primary metric displays,
     - Small sparkline for temperature/vibration,
     - “AI Risk: Medium (simulated)” badge.
   - On click -> Machine detail modal or route with:
     - Last N events,
     - Current open issues for that machine.

4. **Issue Queue Page**
   - Table or list of IssueCards:
     - Priority icon/color,
     - Machine, short description, severity, status, assignedRole, assignedUser,
     - Created time (“2m ago”).
   - Filters:
     - Role, severity, status, machine, search.
   - Each card clickable -> Issue Detail.

5. **Issue Detail View**
   - Header:
     - Title, machine, severity, current status with status dropdown.
   - Sections:
     - Metrics snapshot (inline mini-charts),
     - AI section:
       - “Simulated AI risk: High”
       - “Possible cause: …”
       - “Recommended actions: …”
       - “Estimated downtime: 20 min (simulated), estimated cost: $300 (simulated)”
     - Activity timeline:
       - Status changes, comments, timestamps, user names.
     - Actions:
       - Acknowledge, Change Status, Add Comment, Assign User/Role.

6. **Analytics Dashboard**
   - Top summary cards:
     - Total issues (time range),
     - Average MTTA, MTTR,
     - Total estimated downtime & cost (simulated).
   - Charts:
     - Line chart: Issues per hour/day,
     - Bar chart: Issues by machine,
     - Pie/bar: Issues by severity,
     - Optionally: risk-level chart.

7. **Notifications & Toaster**
   - Lightweight notification component triggered from WebSocket/SSE events.
   - Badge count in nav for new/unread high-priority issues.

8. **Responsive Design**
   - Use CSS grid/flex with Tailwind breakpoints:
     - On mobile: single-column, large buttons,
     - Hide non-critical columns in tables at small widths.

### 6.3 Backend Implementation

**Suggested stack:**
- Node.js + Express, with:
  - `ws` or `socket.io` for WebSocket,
  - In-memory state + simple DB.

**Modules:**

1. **Machine Simulator**
   - Predefined machines: [{ id: 'M1', name: 'Press #1', type: 'Press' }, …].
   - Every X seconds:
     - Generate base readings around nominal values with random noise.
     - Occasionally inject anomalies:
       - High temperature,
       - Spikes in vibration,
       - Throughput drops,
       - Error codes.
   - Mark all sensor data as `isSimulated: true`.

2. **Event & Issue Engine**
   - On each new event:
     - Evaluate:
       - Threshold rules (hard-coded or config):
         - if temp > tempCritical → high severity issue.
       - Anomaly detection:
         - Maintain rolling history, compute mean/stddev, flag outliers.
     - Either:
       - Create a new Issue, or
       - Update an existing open Issue for that machine and type.
   - Assign severity, type, primaryRole, etc.

3. **Priority & Routing**
   - Priority function:
     - `priorityScore = baseSeverityWeight + aiRiskWeight + orderUrgencyWeight + recurrenceWeight`
   - Compute who should get notified (roles).
   - Broadcast issue updates over WebSocket/SSE.

4. **AI Logic (Rule-Based)**
   - For each anomaly/issue:
     - Generate:
       - riskLevel (Low/Medium/High),
       - recommendedCause and recommendedActions from static mapping:
         - e.g., if temp↑ & vib↑ & throughput↓ → “Possible mechanical friction / bearing issue”.
   - Compute estimatedDowntimeMinutes and estimatedCost with simple heuristics:
     - map severity → typical duration,
     - `cost = duration * costPerMinutePerMachine`.

5. **REST + Realtime APIs**
   - REST Endpoints:
     - `GET /machines` – list machines & current status.
     - `GET /issues` – list/filter issues.
     - `GET /issues/:id` – issue details.
     - `POST /issues/:id/acknowledge` – set status, log user/time.
     - `POST /issues/:id/status` – change status, optional comment.
     - `POST /issues/:id/assign` – change assignedUser/Role.
     - `GET /analytics/summary` – summary & charts data.
   - WebSocket/SSE Channels:
     - `/stream/events` – live sensor events.
     - `/stream/issues` – live issue creation/updates.

6. **Persistence**
   - For hackathon: SQLite via Prisma or simple ORM.
   - Tables:
     - `Machine` (id, name, type).
     - `Issue` (id, machineId, type, severity, status, priorityScore, primaryRole, assignedUser, createdAt, updatedAt, estimatedDowntimeMinutes, estimatedCost, isSimulated, isAiEstimated).
     - `IssueEvent` / `IssueActivity` (id, issueId, type, user, comment, createdAt).
     - `MachineEvent` (id, machineId, timestamp, metrics JSON, isSimulated).

7. **Simulation Controls (Optional but Nice)**
   - `POST /simulation/start`, `/simulation/stop`, `/simulation/boostAnomalies`.
   - Small admin UI button to “Trigger burst of issues” for demo.

### 6.4 AI Transparency & Safety

- Add clear **UI labels and disclaimers**:
  - On dashboard: “All data and AI assessments in this demo are simulated and NOT real factory data.”
  - On AI fields: tooltips:
    - “This risk level is generated from a simple demo algorithm, not a validated predictive model.”
- Store boolean flags:
  - `isSimulated`, `isAiEstimated`,
  - and show them on UI for every relevant field.

---

## 7. Success Metrics

Since this is a hackathon prototype, focus on **demo-ability and clarity** rather than production accuracy.

### 7.1 Functional Metrics

- **Real-time Event Streaming**
  - Latency: Events appear on UI within ~1–2 seconds of being generated.
  - Reliability: No crashes during a 10–15 minute continuous demo.

- **Issue Queue with Priority Ranking**
  - Priorities update correctly when:
    - New anomalies appear,
    - Severity or AI risk changes.
  - Highest-severity issues consistently appear at top of the queue.

- **Role-based Notification System**
  - When an issue is created:
    - Relevant roles see new notification without a page refresh.
  - Role filters show only relevant issues.

- **Acknowledgment & Response Tracking**
  - Issue activity log correctly shows:
    - Status transitions, with timestamp + user.
  - MTTA and MTTR on analytics dashboard match manual calculations for a test issue.

- **Mobile-Friendly Interface**
  - Tested on at least one phone:
    - Navigation works,
    - No overlapping or unusable buttons,
    - Live updates visible.

- **Basic Analytics Dashboard**
  - Charts render without errors.
  - Filtering by time/machine updates charts as expected.

- **AI-Powered Predictive Maintenance & Smart Alerts**
  - System detects anomalies at least some of the time (demo cases).
  - Each anomaly-related issue includes:
    - risk level,
    - recommended action text.
  - Downtime/cost estimates present and clearly marked as simulated.

### 7.2 User-Centric / Demo Metrics

- **Clarity in 2 Minutes**: A judge can understand:
  - What’s happening on the line,
  - Which issues are most critical,
  - Who is working on them,
  - Rough (simulated) impact – all from a quick glance.

- **Operator Interaction Speed**
  - Steps to acknowledge and update an issue should be:
    - 2–3 clicks max on mobile,
    - No complex forms.

- **Shared Live View**
  - If two different roles open the app on different devices:
    - They see consistent issue statuses and updates in near real-time.

### 7.3 Technical Quality & Extensibility

- Clear separation between:
  - Simulation layer,
  - Event/issue engine,
  - UI components.
- Code comments / readme explaining:
  - Where to plug in real machine data in future,
  - How AI logic could be replaced with actual ML models.

---

This plan provides enough structure for a prototyping tool to scaffold backend models, APIs, and a React-based front-end with live streaming, role-based views, an issue queue, analytics, and AI-assisted recommendations—all running on simulated factory data and clearly labeled as such.