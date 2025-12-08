<!-- Repository: https://github.com/pleabargain/five-whys -->
<!-- Date: 2025-12-08 -->
# Five Whys Analysis Tool - Project Description

## Overview

The Five Whys Analysis Tool is a web-based educational application designed to help students learn the Five Whys root cause analysis methodology, pioneered by Toyota for investigating workplace problems. The application guides students through a structured "Five Whys" methodology, where asking "why" five times helps dig deep beyond surface-level answers to uncover the true root cause of a problem. This analytical technique helps students understand cause-and-effect relationships and develop lasting, meaningful solutions. The tool integrates with local Ollama AI models to provide intelligent, context-aware question generation tailored to each student's responses.

## Core Features

### 1. Iterative Questioning System (Five Whys Methodology)
- **One Question at a Time**: The application presents only one question at a time, ensuring focused student attention and clear progression through the analysis.
- **Five Levels Deep**: The tool guides students through exactly five levels of "why" questions, following the standard Five Whys root cause analysis methodology pioneered by Toyota.
- **Root Cause Focus**: Each subsequent question digs deeper into cause-and-effect relationships, moving beyond symptoms to identify the true root cause.
- **Context-Aware Questions**: Each subsequent question is generated based on the most important part of the previous answer, maintaining logical progression toward root cause discovery.

### 2. Multiple Choice Answers (MCA)
- **Single MCA Set**: Only one set of multiple-choice answers is presented at a time, maintaining clarity and preventing user confusion.
- **Intelligent Extraction**: The system automatically extracts key phrases from user answers and presents them as selectable options.
- **Focus Selection**: Users select the most important aspect of their answer, which becomes the focus of the next "why" question.

### 3. Visual Tree Representation
- **Interactive Visualization**: A graphical tree diagram displays the branching structure of all "why" questions and answers.
- **SVG-Based Rendering**: The tree is rendered using Scalable Vector Graphics (SVG) for crisp, scalable visualization.
- **Hierarchical Display**: Each level of questioning is visually represented, showing the progression from initial problem to root cause.

### 4. Branch Generation
- **Click-to-Generate**: Users can click on any node in the visualization tree to generate a new alternative "why" branch.
- **Exploration Support**: This feature allows users to explore multiple potential root causes from the same point in the analysis.

### 4. Question & Answer Documentation
- **Complete Logging**: All questions and answers are automatically documented with timestamps.
- **Persistent Record**: The Q&A log provides a complete audit trail of the analysis session, stored in local browser storage.
- **Clipboard Export**: Students can export their complete analysis to clipboard in plain text format for pasting into email submissions to instructors for manual grading.

### 5. Language Sophistication Control
- **CEFR Level Selection**: Users can adjust language complexity using a slider with six levels (A1 through C2) based on the Common European Framework of Reference for Languages (CEFR).
- **Dynamic Text Adjustment**: All generated text (questions, prompts, labels, and messages) automatically adapts to the selected language sophistication level.
- **Simplified Language Support**: Lower levels (A1-A2) use simpler vocabulary, shorter sentences, and clearer phrasing to accommodate users with limited language proficiency.
- **Advanced Language Support**: Higher levels (C1-C2) maintain full complexity and sophisticated phrasing for proficient users.
- **Real-Time Updates**: Language level changes immediately affect all UI text and subsequent question generation.
- **Strict Language Level Enforcement**: The application enforces language level requirements through:
  - **Explicit Prompt Instructions**: Ollama prompts include detailed, level-specific instructions (e.g., A1: maximum 8-10 words, only common vocabulary, simple grammar)
  - **Input Simplification**: Input text is simplified before sending to Ollama for lower language levels (A1-A2)
  - **Post-Processing Validation**: Generated questions are validated and simplified if they exceed complexity limits for the selected level
  - **Word Count Limits**: A1 questions limited to 10 words, A2 to 15 words
  - **Complex Vocabulary Filtering**: Technical terms, business jargon, and advanced vocabulary are removed or replaced for A1-A2 levels

### 6. Local Ollama Integration (Core Requirement)
- **Required Integration**: Ollama AI integration is a core requirement - the application requires Ollama to be running before students can start an analysis.
- **Model Selection**: Students must select from locally installed Ollama models via a dropdown menu before beginning analysis.
- **Automatic Model Discovery**: The application automatically fetches and displays all available Ollama models from the local instance on load.
- **Intelligent Question Generation**: The application uses AI to generate contextually appropriate "why" questions based on student answers, respecting the selected language sophistication level.
- **Enhanced Key Phrase Extraction**: Ollama models improve the extraction of important phrases from student answers, providing more accurate multiple-choice options for deeper analysis.
- **Model Status Display**: The currently selected model name is displayed in a status bar at the top of the interface, always visible to students.
- **Response Time Tracking**: The application tracks and displays the time between user input and Ollama model output in the status bar.
- **Connection Validation**: The application validates Ollama connection before allowing students to start an analysis, blocking start if unavailable.
- **Verbose Console Logging**: All interactions between the user and Ollama are logged to the browser console with detailed information including request URLs, prompts, response times, and error details for debugging and transparency.

### 7. Examples Library
- **Pre-Loaded Examples**: Three hardcoded example analyses are displayed before students start their own analysis, demonstrating proper Five Whys methodology application.
- **Example Domains**: Examples cover three domains: Relationships, Work, and Entertainment - each showing how to progress from problem statement through five levels of "why" to root cause.
- **Display Format**: Examples are presented as a list/grid of titles that students can click to view details.
- **View-Only Interaction**: Examples are view-only - students can read but not modify the example analyses.
- **Educational Purpose**: Examples serve as learning references to help students understand the Five Whys methodology, proper root cause identification, and how to avoid surface-level answers before attempting their own analysis.

## Technical Architecture

### Frontend Technologies
- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with gradients, transitions, and responsive design
- **Vanilla JavaScript**: No external dependencies, pure ES6+ JavaScript

### Application Structure
- **Single Page Application (SPA)**: All functionality contained within one HTML page
- **Object-Oriented Design**: Main application logic encapsulated in the `FiveWhysApp` class
- **Event-Driven**: User interactions handled through event listeners
- **Ollama Integration**: `OllamaIntegration` class handles communication with local Ollama API (default: http://localhost:11434)

### Key Components

1. **Examples Library Section**: Pre-loaded example analyses (Relationships, Work, Entertainment) displayed as list/grid before starting
2. **Ollama Control Section**: Model selection dropdown and status indicator (required before starting analysis)
3. **Status Bar**: Displays currently selected Ollama model name and response time (always visible at top)
4. **Language Control Section**: Slider for adjusting language sophistication level (A1-C2)
5. **Question Section**: Displays current question and answer input
6. **MCA Section**: Shows multiple-choice options when applicable
7. **Documentation Section**: Displays the Q&A log
8. **Controls**: Start/reset functionality, save/load analysis, and clipboard export

### Language Complexity System

The application includes a `LanguageComplexityAdjuster` class that manages text complexity across six CEFR levels:

- **A1 (Beginner)**: Very simple language, minimal vocabulary, short phrases
- **A2 (Elementary)**: Simple language, basic vocabulary, straightforward sentences
- **B1 (Intermediate)**: Moderate complexity, standard vocabulary (default level)
- **B2 (Upper Intermediate)**: Moderate-high complexity, varied vocabulary
- **C1 (Advanced)**: Complex language, sophisticated vocabulary
- **C2 (Proficient)**: Very complex language, advanced vocabulary and phrasing

All user-facing text templates are defined for each complexity level, ensuring consistent language sophistication throughout the application experience.

## User Workflow

1. **View Examples** (optional): Student reviews pre-loaded example analyses (Relationships, Work, Entertainment) displayed as list/grid to understand proper Five Whys methodology
2. **Select Ollama Model** (required): Student must select a local Ollama model from the dropdown before starting
3. **Set Language Level** (optional): Student adjusts the language sophistication slider to their preferred level (A1-C2)
4. **Start Analysis**: Student clicks "Start New Analysis" button (blocked if Ollama not connected)
5. **Problem Statement**: Student enters the initial problem statement they want to investigate (e.g., "Our fundraising campaign missed its goal")
6. **First Why**: Application asks "Why did [problem] happen?" (AI-generated via Ollama, respecting selected language level)
7. **Answer Submission**: Student provides their answer, identifying contributing factors
8. **Key Phrase Extraction**: System extracts important parts from the answer using Ollama AI to identify the most significant cause
9. **MCA Display** (if applicable): Student selects the most important aspect from extracted phrases (text simplified based on language level)
10. **Subsequent Whys**: System asks "Why did [selected cause] happen?" - repeating this process for each level
11. **Response Time Display**: Model name and response time displayed in status bar
12. **Five Levels Complete**: After asking "why" five times total, the final answer should represent the root cause
13. **Save/Load**: Student can save analysis progress to a JSON file and load it later to continue work
14. **Export**: Student exports analysis to clipboard (plain text) for email submission to instructor
15. **Console Logging**: All Ollama interactions are logged to browser console for debugging and transparency

## Design Principles

### Rules and Constraints
- **One Question at a Time**: Never present multiple questions simultaneously - follows Five Whys methodology of sequential questioning
- **One MCA Set at a Time**: Only show one set of multiple-choice answers per interaction
- **Five Whys Structure**: Application enforces exactly five levels of "why" questions, following the standard methodology
- **Root Cause Focus**: Emphasizes moving beyond symptoms to identify true root causes through cause-and-effect relationships
- **Complete Documentation**: All Q&A interactions are logged with timestamps and stored locally, creating a complete audit trail
- **Student Control**: Students can reset and start new analyses at any time
- **Language Consistency**: All generated text must comply with the selected language sophistication level
- **Ollama Required**: Application requires Ollama connection before starting analysis - blocks start if unavailable
- **Model Visibility**: Currently selected Ollama model name always visible in status bar
- **Response Time Tracking**: Time between user input and Ollama output tracked and displayed
- **Local Processing**: All AI processing happens locally via Ollama; no data sent to external servers
- **Examples View-Only**: Example analyses are read-only educational references demonstrating proper Five Whys methodology
- **Verbose Logging**: All Ollama API interactions logged to console with request/response details, response times, and error information

### User Experience
- **Modern UI**: Clean, gradient-based design with smooth transitions
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Feedback**: Hover effects, selection states, and clear visual hierarchy
- **Accessibility**: Keyboard support (Ctrl+Enter to submit) and clear labeling

## File Structure

```
five-whys/
├── index.html              # Main HTML structure
├── styles.css              # Application styling
├── app.js                  # Core application logic
├── tests.js                # Unit tests for user-facing functions
├── project-description.md  # This document
└── requirements-qa-log.md  # Requirements gathering Q&A log
```

## Future Enhancement Opportunities

- Enhanced Ollama prompt engineering for better question quality aligned with Five Whys methodology
- Support for streaming responses from Ollama for real-time question generation
- Model performance comparison and recommendations
- Additional example analyses in the examples library covering different problem types
- Configurable examples (JSON-based) instead of hardcoded
- Tutorial/guided walkthrough explaining Five Whys methodology and Toyota origin
- Hints and tips during analysis to help students avoid surface-level answers
- "Run it backwards" verification feature - students can verify root cause by connecting causes with "therefore" statements
- Breakout style analysis support for exploring multiple root causes
- Integration with learning management systems (LMS)
- Instructor dashboard for viewing student progress
- Solution brainstorming feature after root cause identification (following Five Whys best practices)

## Browser Compatibility

The application is designed to work on modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Local file download API
- Fetch API for Ollama communication

Tested and optimized for:
- Chrome/Edge (latest versions)
- Firefox (latest versions)
- Safari (latest versions)

## Ollama Setup (Required)

**Ollama is a core requirement** - students cannot start an analysis without Ollama running. To use the application:

1. **Install Ollama**: Download and install Ollama from https://ollama.ai
2. **Start Ollama Service**: Ensure Ollama is running locally (default: http://localhost:11434)
3. **Download Models**: Install desired language models using `ollama pull <model-name>` (e.g., `ollama pull llama2`, `ollama pull mistral`)
4. **Select Model**: Students must choose a model from the dropdown before starting analysis
5. **Verify Connection**: The application validates Ollama connection and blocks "Start Analysis" if unavailable

The application automatically detects available models when loaded. The selected model name and response times are displayed in the status bar at the top of the interface.

## Methodology Reference

This application implements the Five Whys root cause analysis methodology, an analytical technique pioneered by Toyota for investigating workplace problems. The methodology helps teams dig deep beyond surface-level answers to uncover true root causes through systematic cause-and-effect questioning. For more information about the Five Whys methodology, see: [Atlassian's Guide to 5 Whys Analysis](https://www.atlassian.com/blog/teamwork/5-whys-analysis)

---

Last Updated: 2025-01-27T14:30:00

