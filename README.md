# Citizen Portal (JanaSamadhan) — Jharkhand Societal Innovation Platform

Public-facing citizen engagement and accountability portal for the state of Jharkhand. Allows citizens to report civic and infrastructure problems, track resolution lifecycles, conduct community work verification audits, and submit anonymous whistleblower/anti-corruption reports with statutory inquiry triggers.

---

## Features
- **Civic Problem Reporting**: Submit problems with voice simulation, photo attachments, and geolocation tagging across all 24 Jharkhand districts and blocks.
- **AI Problem Intelligence**: Automated categorization, duplicate clustering, estimated department routing, and SLA urgency calculation.
- **My Reports Tracker**: Real-time progress timeline (`Submitted` &rarr; `Triaged` &rarr; `Assigned` &rarr; `In Progress` &rarr; `Resolved` &rarr; `Citizen Verified`).
- **Community Work Verification**: Citizens perform ground audits of completed public works, voting Confirmed vs. Problems Found with photographic evidence.
- **Anti-Corruption & Whistleblower Module**: Anonymous integrity reporting with a statutory 10,000+ citizen trigger that escalates concerns to the Vigilance Commission.
- **State Infrastructure Registry**: Transparent lookup of public assets, contract values, warranty status, and contractor performance ratings.
- **Bilingual Support**: Instant toggle between English and Hindi (हिन्दी).

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Framer Motion
- **Backend**: Node.js, Express, tsx
- **Persistence**: File-backed JSON store with transactional safety (`src/db/storage.ts`) and PostgreSQL support when configured

---

## Default Port
Runs by default on **Port 3001** to avoid collision with other platforms in the ecosystem.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```env
PORT=3001
NODE_ENV=development
# Optional: connect to PostgreSQL if available
# SQL_HOST=localhost
# SQL_DB_NAME=jharkhand_governance
# SQL_USER=postgres
# SQL_PASSWORD=postgres
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser to: [http://localhost:3001](http://localhost:3001)

### 4. Build for Production
```bash
npm run build
npm start
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/v1/citizen/profile` | Current authenticated citizen profile |
| `GET` | `/api/v1/citizen/challenges` | List problems with filters (`district`, `category`, `status`) |
| `POST` | `/api/v1/citizen/challenges` | Submit a new civic problem report |
| `GET` | `/api/v1/citizen/challenges/:id` | Problem details and comment thread |
| `POST` | `/api/v1/citizen/challenges/:id/support` | Support problem ("I experience this too") |
| `POST` | `/api/v1/citizen/challenges/:id/comments` | Post comment to problem discussion |
| `GET` | `/api/v1/citizen/verifications` | List community work verification audits |
| `POST` | `/api/v1/citizen/verifications/:id/vote` | Submit ground verification audit vote |
| `GET` | `/api/v1/citizen/integrity` | List public whistleblower/integrity cases |
| `POST` | `/api/v1/citizen/integrity` | Submit an anti-corruption integrity concern |
| `POST` | `/api/v1/citizen/integrity/:id/support` | Upvote integrity case towards 10k trigger |
| `GET` | `/api/v1/citizen/infrastructure` | View monitored public infrastructure assets |
| `GET` | `/api/v1/citizen/notifications` | Citizen notification feed |
