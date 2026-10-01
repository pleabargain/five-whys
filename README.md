<!-- Repository: https://github.com/pleabargain/five-whys -->
<!-- Date: 2025-12-08 -->
# Five Whys Analysis Tool

A web-based application for performing root cause analysis using the Five Whys methodology. This tool guides users through iterative questioning to uncover the underlying causes of problems.

## How to Start This Application

### Quick Start

1. **Install Ollama** (Required)
   - Download and install Ollama from https://ollama.com
   - Start the Ollama service (it should run automatically after installation at `http://localhost:11434`)

2. **Download a Model**
   - Open a terminal/command prompt
   - Run: `ollama pull llama3.2` (or other modern models such as `llama3.3`, `qwen2.5`, `deepseek-r1`, `mistral`, `gemma2`, `phi4`)
   - Wait for the model to download

3. **Open the Application**
   - Open `index.html` in any modern web browser
   - The application will automatically detect available Ollama models

4. **Start Your Analysis**
   - Select an Ollama model from the dropdown (required)
   - Optionally adjust the language sophistication level (A1-C2)
   - Review example analyses if desired
   - Click "Start New Analysis"
   - Enter your problem statement
   - Follow the prompts through five levels of "why" questions

### Important Notes

- **Ollama is Required**: The application will not start without an Ollama model selected
- **Local Processing**: All AI processing happens locally on your computer via Ollama
- **No Internet Required**: Once Ollama and models are installed, the application works offline

## Features

- **Iterative Questioning**: One question at a time, five levels deep
- **Multiple Choice Answers (MCA)**: Automatic extraction of key phrases with single-set selection
- **Interactive Tree Visualization**: Visual representation of the branching "why" structure
- **Branch Generation**: Click any node to generate alternative "why" branches
- **Complete Documentation**: All questions and answers logged with timestamps
- **Export Functionality**: Copy analysis to clipboard (plain text) for email submission
- **Save/Load Analysis**: Save your analysis to JSON file and load it later to continue or review
- **Data Validation**: Automatic validation ensures saved files are complete and loadable
- **Examples Library**: Three pre-loaded example analyses (Relationships, Work, Entertainment)
- **Language Sophistication Control**: Adjust complexity level (A1-C2) for all generated text
- **Ollama AI Integration**: AI-powered question generation using local Ollama models with professional business analyst prompts
- **Response Time Tracking**: Monitor AI response times in real-time via status bar
- **Deep Analysis**: Generate advanced analysis reports with further exploration questions, data collection approaches, and analysis summaries (respects selected language level and indicates language level in report)
- **Interactive Tree Visualization**: Visual representation of the complete Five Whys analysis tree

## Getting Started

### Prerequisites

- **Ollama**: Must be installed and running locally at `http://localhost:11434` (download from https://ollama.com)
- **Ollama Model**: At least one generative model downloaded (e.g., `ollama pull llama3.2`, `ollama pull qwen2.5`, or `ollama pull deepseek-r1`)
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Running the Application

1. Ensure Ollama is running and you have at least one model downloaded
2. Open `index.html` in any modern web browser
3. Select an Ollama model from the dropdown (required)
4. Optionally adjust language sophistication level
5. Review example analyses if desired
6. Click "Start New Analysis"
7. Enter your problem statement
8. Follow the prompts through five levels of "why" questions

### Usage

1. **Start**: Click "Start New Analysis" and enter your problem statement
2. **Answer**: Provide detailed answers to each "why" question (AI-generated questions use professional business analyst terminology)
3. **Select**: When multiple-choice options appear, select the most important aspect
4. **Explore**: After completion, click nodes in the visualization to generate alternative branches
5. **Save**: Use "Save Analysis" to save your progress as a JSON file for later
6. **Load**: Use "Load Analysis" to continue a previously saved analysis
7. **Deep Analysis**: After completing an analysis, click "Deep Analysis" to generate advanced insights including further exploration questions, data collection approaches, and analysis summaries (uses currently selected model and language level - language level is indicated in the report header and copied text)
8. **Export**: Use "Copy to Clipboard" to copy your analysis for email submission to instructors

## Keyboard Shortcuts

- **Ctrl + Enter**: Submit answer (when typing in the answer field)

## File Structure

```
five-whys/
├── index.html              # Main application page
├── styles.css              # Application styles
├── app.js                  # Core application logic
├── tests.js                # Unit tests for user-facing functions
├── project-description.md  # Detailed project documentation
├── requirements-qa-log.md  # Requirements gathering Q&A log
└── README.md              # This file
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Technical Details

- Pure JavaScript (no external dependencies)
- Ollama AI integration for intelligent question generation with automated server health checks and thinking-tag sanitization
- Automatic discovery and filtering of generative chat models (excludes non-generative embedding models)
- SVG-based tree visualization with proper spacing and layout
- Responsive design
- Local browser storage for session data
- Clipboard API for export functionality
- File API for save/load functionality
- Data validation for save/load operations
- Unit tests for critical user-facing functions

## Testing

The application includes unit tests for user-facing functions. To run tests:

1. **Browser Console Method**: 
   - Open the application in your browser
   - Open Developer Tools (F12)
   - In the console, type: `window.runTests = true` and press Enter
   - Tests will run automatically

2. **URL Parameter Method**:
   - Add `?test=true` to the URL (e.g., `file:///path/to/index.html?test=true`)
   - Tests will run automatically on page load

### Test Coverage

The test suite (`tests.js`) includes tests for:
- **Data Validation**: Save/load data structure validation
- **Text Processing**: Text truncation and key phrase extraction
- **Language Complexity**: Language level adjustment and text simplification
- **Export Functionality**: Clipboard export format validation
- **Problem Statement**: Input validation

All tests output results to the browser console with pass/fail indicators and success rate statistics.

## License

This project is provided as-is for educational and personal use.

---

Last Updated: 2025-12-08

