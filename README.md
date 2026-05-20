# KI Fluency Kompetenzmatrix – ABA

Eine interaktive Web-Applikation zur Bewertung von Microsoft Copilot-Kompetenzen in Organisationen.
Entwickelt für ABA – Austrian Business Agency, im Rahmen des DIH-Ost Projekts.

## Features

- **Selbsteinschätzung** – 36 Use Cases in 9 Copilot-Bereichen, Level 0–4
- **Dashboard** – Radar-Chart, Stärken/Lücken-Übersicht, Reifegrad-Badge
- **Entwicklungsplan** – Automatisch generierte Gap-Analyse mit Microsoft Learn Links
- **Team-Überblick** – Heatmap-Tabelle, Abteilungsvergleich, CSV-Export
- **Offline-fähig** – Alle Daten in localStorage, kein Backend notwendig

## Quick Start

```bash
npm install
npm run dev
```

Die App läuft dann unter **http://localhost:5173**

## Build

```bash
npm run build
npm run preview
```

## Technologie-Stack

| Technologie | Verwendung |
|-------------|------------|
| React 19 + TypeScript | UI Framework |
| Tailwind CSS 4 | Styling |
| Recharts 3 | Diagramme (Radar, Bar) |
| Lucide React | Icons |
| Vite 8 | Build Tool |

## Projektstruktur

```
src/
├── components/
│   ├── Assessment/       # Selbsteinschätzungs-Formular
│   ├── Dashboard/        # Persönliches Dashboard mit Charts
│   ├── GapAnalysis/      # Entwicklungsplan
│   ├── Layout/           # Navbar
│   ├── Profile/          # Onboarding & Profil-Setup
│   ├── TeamOverview/     # HR/Manager Heatmap-Ansicht
│   └── shared/           # LevelBadge, ProgressBar, ScoreDisplay
├── data/
│   ├── competencies.ts   # 9 Bereiche, 36 Use Cases
│   └── seedData.ts       # Demo-Daten für 8 Mitarbeiter:innen
├── hooks/
│   └── useAssessmentStore.ts  # Haupthook: localStorage + Berechnungen
├── types/index.ts
└── utils/csvExport.ts    # CSV-Export
```

## Reifegradmodell

| Score | Badge | Bedeutung |
|-------|-------|-----------|
| 0.0–0.9 | 🔴 Einsteiger | Keine Kenntnisse |
| 1.0–1.9 | 🟠 Grundkenntnisse | Bewusstsein vorhanden |
| 2.0–2.9 | 🟡 Fortgeschritten | Mit Unterstützung |
| 3.0–3.9 | 🟢 Kompetent | Selbstständig |
| 4.0 | 🏆 Experte | Gibt Wissen weiter |
