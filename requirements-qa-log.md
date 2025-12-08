<!-- Repository: https://github.com/pleabargain/five-whys -->
# Requirements Gathering Q&A Log
## Five Whys Analysis Tool - Project Scope Definition

**Date Started:** 2025-01-27  
**Status:** In Progress

---

## Questions and Answers

### Q1: What is the primary use case or target audience for this Five Whys Analysis Tool?
**Options:**
- A) Business professionals and managers conducting root cause analysis
- B) Students learning problem-solving methodologies
- C) Quality engineers and process improvement teams
- D) General public / personal problem-solving
- E) Multiple audiences (general-purpose tool)

**Answer:** B) Students learning problem-solving methodologies

---

### Q2: What is the primary deployment environment for this application?
**Options:**
- A) Standalone desktop application (Electron, etc.)
- B) Web application accessed via browser (current implementation)
- C) Mobile app (iOS/Android)
- D) Integrated into a learning management system (LMS)
- E) Multiple platforms (web + mobile)

**Answer:** B) Web application accessed via browser (current implementation)

---

### Q3: What level of data persistence/storage is required for student analyses?
**Options:**
- A) No storage needed (analyses are temporary, session-only)
- B) Local browser storage only (localStorage/sessionStorage)
- C) Cloud storage with user accounts (save/load analyses)
- D) Export-only functionality (users export to files, no built-in storage)
- E) Integration with external storage systems (Google Drive, etc.)

**Answer:** B) Local browser storage only (localStorage/sessionStorage)

---

### Q4: What educational features should be included to support student learning?
**Options:**
- A) Basic tool only (no educational features)
- B) Hints and tips during analysis
- C) Tutorial/guided walkthrough for first-time users
- D) Examples library with sample analyses
- E) Multiple features (hints, tutorials, examples, feedback)

**Answer:** D) Examples library with sample analyses

---

### Q5: Should the Ollama AI integration be a core requirement or optional enhancement?
**Options:**
- A) Core requirement (application requires Ollama to function)
- B) Optional enhancement (works without Ollama, enhanced with it)
- C) Not needed (remove Ollama integration entirely)
- D) Advanced feature (available but not prominently featured)

**Answer:** A) Core requirement (application requires Ollama to function)

---

### Q6: How should the examples library be accessed and used by students?
**Options:**
- A) Pre-loaded examples visible before starting analysis
- B) Examples accessible during analysis (reference while working)
- C) Completed example analyses students can explore/review
- D) Template problems students can load and analyze
- E) Multiple access methods (pre-loaded, during analysis, templates, completed examples)

**Answer:** A) Pre-loaded examples visible before starting analysis

---

### Q7: What should happen when students interact with pre-loaded examples?
**Options:**
- A) View-only (students can read but not modify)
- B) Load as starting point (students can continue/modify the analysis)
- C) Interactive exploration (students can navigate through the example tree)
- D) Comparison mode (students compare their analysis with the example)
- E) Multiple interaction types (view, load, explore, compare)

**Answer:** A) View-only (students can read but not modify)

---

### Q8: Are there any assessment or grading features needed for instructors?
**Options:**
- A) No assessment features needed
- B) Export student work for manual grading (export analyses)
- C) Automated scoring/rubric evaluation
- D) Instructor dashboard to view student progress
- E) Multiple assessment features (export, scoring, dashboard)

**Answer:** B) Export to clipboard for pasting to email (for manual grading)

---

### Q9: What format should the clipboard export use?
**Options:**
- A) Plain text format (simple text)
- B) Formatted text (with structure/formatting)
- C) HTML format (for rich email formatting)
- D) Markdown format (structured text)
- E) Multiple format options (user chooses)

**Answer:** A) Plain text format (simple text)

---

### Q10: Should the language sophistication control (A1-C2 slider) be retained for student use?
**Options:**
- A) Yes, keep it (students can adjust language complexity)
- B) No, remove it (not needed for student audience)
- C) Simplified version (fewer levels, e.g., Simple/Medium/Complex)
- D) Hidden/advanced option (available but not prominently displayed)

**Answer:** A) Yes, keep it (students can adjust language complexity)

---

### Q11: What subject domains or problem types should the examples library cover?
**Options:**
- A) General/business problems (productivity, quality, etc.)
- B) Academic problems (research, study methods, etc.)
- C) Technical problems (software, engineering, etc.)
- D) Personal/social problems (relationships, habits, etc.)
- E) Multiple domains (mix of different problem types)

**Answer:** Three examples covering:
1. Relationships
2. Work
3. Entertainment

---

### Q12: How should the examples be displayed in the UI before students start their analysis?
**Options:**
- A) List/grid of example titles (click to view details)
- B) Expandable cards with preview (expand to see full analysis)
- C) Modal/dialog popup (click to open full example in overlay)
- D) Sidebar panel (examples always visible in side panel)
- E) Tabbed interface (separate tab for examples)

**Answer:** A) List/grid of example titles (click to view details)

---

### Q13: Should the application validate that Ollama is running before allowing students to start an analysis?
**Options:**
- A) Yes, require Ollama connection (block start if unavailable)
- B) No, allow start but show warning if Ollama unavailable
- C) Yes, with clear error message explaining how to start Ollama
- D) Auto-detect and adapt (use templates if Ollama unavailable, show status)

**Answer:** A) Yes, require Ollama connection (block start if unavailable) + indicate which model is being used + track time between user input and Ollama model output

---

### Q14: Where should the model name and response time be displayed to students?
**Options:**
- A) Status bar at top (always visible)
- B) Near the question being generated (contextual display)
- C) Loading indicator during generation (show time when complete)
- D) In the Q&A log entry (recorded with each question)
- E) Multiple locations (status bar + log entry)

**Answer:** A) Status bar at top (always visible)

---

### Q15: Should the examples be hardcoded in the application or configurable/editable by instructors?
**Options:**
- A) Hardcoded examples (fixed in application code)
- B) Configurable via JSON/config file (editable without code changes)
- C) Editable through admin UI (instructors can modify examples)
- D) Loaded from external source (URL/file upload)

**Answer:** A) Hardcoded examples (fixed in application code)

---

## Summary

**Target Audience:** Students learning problem-solving methodologies  
**Deployment:** Web application (browser-based)  
**Storage:** Local browser storage (localStorage/sessionStorage)  
**Core Features:**
- Ollama AI integration (required)
- Examples library (3 examples: Relationships, Work, Entertainment)
- Language sophistication control (A1-C2)
- Clipboard export (plain text) for email submission
- Model name and response time tracking displayed in status bar

**Status:** Requirements gathering in progress - awaiting additional questions to reach 90% certainty

---

**Last Updated:** 2025-01-27

