export interface UseCase {
  id: number;
  title: string;
  microsoftLearnUrl: string;
}

export interface CompetencyArea {
  id: string;
  title: string;
  icon: string;
  useCases: UseCase[];
}

export const COMPETENCY_AREAS: CompetencyArea[] = [
  {
    id: 'grundeinstellungen',
    title: 'Grundeinstellungen Copilot',
    icon: 'Settings',
    useCases: [
      { id: 1, title: 'Copilot-Einstellungen prüfen (Datenschutz, Datenquellen)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/copilot/microsoft-365/microsoft-365-copilot-privacy' },
      { id: 2, title: 'Kontextbewusstsein nutzen (welche M365-Daten werden genutzt)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/copilot/microsoft-365/microsoft-365-copilot-overview' },
      { id: 3, title: 'Grenzen kennen (Verifikation, No-Go-Use-Cases)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/copilot/microsoft-365/microsoft-365-copilot-overview' },
      { id: 4, title: 'Feedback geben (Thumb up/down, Prompt-Nachschärfung)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/copilot/microsoft-365/microsoft-365-copilot-overview' },
    ],
  },
  {
    id: 'teams',
    title: 'Copilot in Teams',
    icon: 'Users',
    useCases: [
      { id: 5, title: 'Meeting-Zusammenfassungen nutzen (Kernaussagen, Entscheidungen, offene Punkte)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoftteams/copilot-teams-transcription' },
      { id: 6, title: 'Aufgaben aus Meetings ableiten (To-dos, Owner, Fristen)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoftteams/copilot-teams-transcription' },
      { id: 7, title: 'Chat-Verläufe zusammenfassen (lange Diskussionen verdichten)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoftteams/copilot-teams-transcription' },
      { id: 8, title: 'Fragen an vergangene Meetings/Chats stellen', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoftteams/copilot-teams-transcription' },
    ],
  },
  {
    id: 'word',
    title: 'Copilot in Word',
    icon: 'FileText',
    useCases: [
      { id: 9, title: 'Entwürfe aus Stichworten erstellen', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/admin/misc/copilot-overview' },
      { id: 10, title: 'Umformulieren (kürzen, vereinfachen, Tonalität)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/admin/misc/copilot-overview' },
      { id: 11, title: 'Struktur verbessern (Gliederung, Überschriften, Argumentationslogik)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/admin/misc/copilot-overview' },
      { id: 12, title: 'Dokumente analysieren (Kernaussagen, Lücken, Empfehlungen)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/admin/misc/copilot-overview' },
    ],
  },
  {
    id: 'excel',
    title: 'Copilot in Excel',
    icon: 'BarChart2',
    useCases: [
      { id: 13, title: 'Daten erklären lassen (Bedeutung, Muster, Auffälligkeiten)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/office/dev/add-ins/excel/excel-add-ins-overview' },
      { id: 14, title: 'Formeln generieren (z.B. XLOOKUP, IF, COUNTIFS)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/office/dev/add-ins/excel/excel-add-ins-overview' },
      { id: 15, title: 'Daten bereinigen (Dubletten, Formate, Fehler)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/office/dev/add-ins/excel/excel-add-ins-overview' },
      { id: 16, title: 'Einfache Analysen (Trends, Rankings, Ausreißer)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/office/dev/add-ins/excel/excel-add-ins-overview' },
    ],
  },
  {
    id: 'outlook',
    title: 'Copilot in Outlook',
    icon: 'Mail',
    useCases: [
      { id: 17, title: 'E-Mail-Threads zusammenfassen', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/admin/misc/copilot-overview' },
      { id: 18, title: 'Antwortvorschläge nutzen (Tonalität, Kürze)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/admin/misc/copilot-overview' },
      { id: 19, title: 'Follow-ups erkennen (Aufgaben, Fristen, nächste Schritte)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/admin/misc/copilot-overview' },
      { id: 20, title: 'Terminvorbereitung (Kontext aus Mails/Anhängen extrahieren)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/admin/misc/copilot-overview' },
    ],
  },
  {
    id: 'dynamics',
    title: 'Copilot in Dynamics 365',
    icon: 'Database',
    useCases: [
      { id: 21, title: 'Datensätze zusammenfassen (Account/Lead/Opportunity)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/dynamics365/copilot/overview' },
      { id: 22, title: 'Interaktionsverlauf verstehen (Timeline-Analyse)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/dynamics365/copilot/overview' },
      { id: 23, title: 'Empfehlungen nutzen (Next Best Action, Priorisierung)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/dynamics365/copilot/overview' },
      { id: 24, title: 'Texte generieren (Notizen, E-Mails, Beschreibungen)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/dynamics365/copilot/overview' },
    ],
  },
  {
    id: 'recherche',
    title: 'Copilot Chat für Recherche',
    icon: 'Search',
    useCases: [
      { id: 25, title: 'Interne Recherche (SharePoint/OneDrive/Dateien)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-overview' },
      { id: 26, title: 'Externe Recherche strukturieren und verifizieren (Quellenkritik)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-overview' },
      { id: 27, title: 'Zusammenfassungen erstellen (Management-tauglich)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-overview' },
      { id: 28, title: 'Vergleichsanfragen (Optionen, Pro/Contra, Entscheidungsvorlage)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-overview' },
    ],
  },
  {
    id: 'agenten',
    title: 'Copilot Agenten anwenden',
    icon: 'Bot',
    useCases: [
      { id: 29, title: 'Agent ausführen (vordefinierte Agenten korrekt nutzen)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-agents' },
      { id: 30, title: 'Ergebnisse interpretieren (keine Blindübernahme, Verifikation)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-agents' },
      { id: 31, title: 'Agent gezielt auswählen (Use-Case-Fit)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-agents' },
      { id: 32, title: 'Feedback geben/Verbesserungen melden (QA)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-agents' },
    ],
  },
  {
    id: 'promptlibrary',
    title: 'Prompt Library kennen',
    icon: 'BookOpen',
    useCases: [
      { id: 33, title: 'Prompt Library finden und öffnen', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-prompt-gallery' },
      { id: 34, title: 'Passende Prompts auswählen (Use-Case-basiert)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-prompt-gallery' },
      { id: 35, title: 'Prompts anpassen (Kontext, Zielgruppe, Outputformat)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-prompt-gallery' },
      { id: 36, title: 'Eigene Prompts beitragen (wiederverwendbar, sauber beschrieben)', microsoftLearnUrl: 'https://learn.microsoft.com/de-de/microsoft-365/copilot/microsoft-365-copilot-prompt-gallery' },
    ],
  },
];

export const LEVEL_LABELS: Record<number, string> = {
  0: 'Unbekannt',
  1: 'Kennt Use Case',
  2: 'Mit Anleitung',
  3: 'Selbstständig',
  4: 'Optimiert / teilt Wissen',
};

export const LEVEL_COLORS: Record<number, string> = {
  0: '#9ca3af',
  1: '#f87171',
  2: '#fb923c',
  3: '#60a5fa',
  4: '#34d399',
};

export const LEVEL_BG_COLORS: Record<number, string> = {
  0: 'bg-gray-400',
  1: 'bg-red-400',
  2: 'bg-orange-400',
  3: 'bg-blue-400',
  4: 'bg-emerald-400',
};

export const DEPARTMENTS: Record<string, string[]> = {
  Administration: ['Backoffice', 'Buchhaltung', 'Compliance', 'Controlling', 'HR', 'Legal'],
  Geschäftsführung: ['Management', 'Assistenz', 'Strategieentwicklung'],
  Geschäftskunden: ['Key Account', 'Relationship Management', 'Solution Sales'],
  IT: ['Entwicklung', 'IT-Support', 'Product Owner', 'Projektmanagement', 'Systemadministration'],
  'Marketing-Kommunikation': ['Grafik', 'Online Communications', 'PR', 'Print', 'Content Management'],
  Privatkunden: ['Beratung', 'Kundenservice', 'Vertrieb'],
  Vertriebssupport: ['Angebotserstellung', 'CRM-Management', 'Tender Management'],
};

export const BEWERTUNGSZEITRAEUME = ['H1 2024', 'H2 2024', 'H1 2025', 'H2 2025', 'H1 2026', 'H2 2026'];
