<!-- Repository: https://github.com/pleabargain/five-whys -->
<!-- Date: 2026-10-01 -->
# Academic Exercise: Root Cause Analysis via Iterative Inquiry and Local Large Language Models

**Curricular Module**: Systems Engineering, Quality Management, and Applied Natural Language Processing  
**Pedagogical Framework**: The Five Whys Heuristic (Toyota Production System) & CEFR Linguistic Stratification  
**Computational Substrate**: Localized Large Language Model (LLM) Inference via Ollama  

---

## Abstract

This document delineates the academic and operational specifications for an interactive pedagogical laboratory exercise designed to cultivate root cause analysis (RCA) competencies. Rooted in the foundational industrial engineering methodology formulated by Taiichi Ohno at Toyota Motor Corporation, the exercise obliges students to transcend symptomatic problem characterizations by traversing five successive strata of causal inquiry. To scaffold student reasoning while accommodating heterogenous linguistic proficiencies, the system integrates a locally hosted Large Language Model (LLM) interface via Ollama. This interface generates context-dependent Socratic prompts calibrated to the Common European Framework of Reference for Languages (CEFR, A1–C2). This document details the pedagogical objectives, theoretical foundations, operational laboratory protocol, computational architecture, model filtering standards, and evaluative grading criteria governing the exercise.

---

## 1. Pedagogical Rationale & Theoretical Foundations

### 1.1 The Five Whys Heuristic and Systems Thinking
Originally synthesized within the Toyota Production System (TPS) during the mid-20th century, the Five Whys methodology constitutes an inductive problem-solving heuristic designed to delineate linear and branching causal chains. Superficial operational anomalies ("symptoms") frequently stem from latent organizational, procedural, or infrastructural deficits ("root causes"). By demanding five sequential tiers of inquiry—each recursively anchored to the critical causal factor of the antecedent tier—the student is compelled to transition from descriptive observation to systemic diagnosis.

### 1.2 Linguistic Calibration via CEFR Stratification
Educational efficacy requires that syntactic complexity does not obscure conceptual cognition. The exercise incorporates dynamic text scaling indexed against the Common European Framework of Reference for Languages (CEFR):
- **Tier A1 (Breakthrough / Beginner)**: Lexical corpus restricted to high-frequency terms; maximal sentence lengths of 8–10 words; strict prohibition of subordinate clauses and passive voice constructions.
- **Tier A2 (Waystage / Elementary)**: Direct syntax; exclusion of domain jargon; maximal lengths of 12–15 words.
- **Tier B1–B2 (Independent User / Vantage)**: Standard and upper-intermediate vernacular; contextual introduction of operational terminology; moderate syntactic nesting.
- **Tier C1–C2 (Proficient / Mastery)**: Nuanced idiomatic syntax, academic formulations, and exhaustive socio-technical vocabulary.

### 1.3 Local, Privacy-Preserving Neuro-Symbolic Architecture
In accordance with institutional data governance and student privacy directives, all artificial intelligence inference is executed entirely within the local computational perimeter via the Ollama runtime daemon (`http://localhost:11434`). No instructional telemetry, student transcripts, or problem declarations are transmitted to third-party cloud infrastructure.

---

## 2. Learning Objectives & Curricular Competencies

Upon successful completion of this laboratory exercise, students will demonstrate mastery in the following competencies:
1. **Causal Discrimination**: Differentiate between immediate proximate causes, contributing environmental factors, and governing systemic root causes.
2. **Socratic Formulation**: Construct and evaluate interrogative propositions that advance an investigation without introducing confirmation bias or non-sequiturs.
3. **Disambiguation and Multi-Branch Hypothesis Testing**: Identify when a causal node admits multiple divergent explanations and formulate alternative exploratory branches.
4. **Adaptive Communication**: Communicate complex operational deficits across diverse registers of language sophistication (CEFR A1 through C2).
5. **Empirical Synthesis**: Formulate concrete empirical validation strategies and metric collections to verify hypothetical root causes.

---

## 3. Laboratory Protocol & Operational Workflow

```
[Phase I: Initial Problem Statement]
                  │
                  ▼
[Phase II: Sequential Tier-1..5 Socratic Interrogation]
                  │
                  ▼
[Phase III: Causal Key-Phrase Extraction & MCA Disambiguation]
                  │
                  ▼
[Phase IV: Multi-Branch Exploration & Root Cause Verification]
                  │
                  ▼
[Phase V: Deep Analytical Synthesis & Instructor Submission]
```

### Phase I: Problem Formulation & Baseline Declaration
1. The student initializes the local Ollama daemon and confirms server availability via the automated diagnostic health check.
2. The student selects an authorized, generative completion model (e.g., `llama3.3`, `llama3.2`, `qwen2.5`, `deepseek-r1`, `mistral`, `gemma2`) from the validated model registry.
3. The student defines the initial problem statement (e.g., *"Automated integration test suites failed in the staging pipeline"*).

### Phase II: Sequential Interrogation & Contextual Prompting
1. The application queries the local LLM daemon, providing the simplified prior response and the active CEFR constraint directives.
2. The model synthesizes a targeted, grammatically constrained interrogative proposition commencing with the interrogative adverb *"Why"*.
3. The student enters an analytical response explaining the proximate causal factor.

### Phase III: Key Causal Factor Extraction & Disambiguation
1. The system extracts 2 to 4 salient causal concepts from the student's prose, formatting each as a discrete prospective inquiry.
2. The student reviews the Multiple Choice Answer (MCA) array and selects the primary causal driver, mitigating cognitive drift and maintaining analytical focus.

### Phase IV: Tree Construction & Alternative Branching
1. The investigation proceeds iteratively through exactly five tiers.
2. Following five iterations, the terminal leaf node represents the hypothesized root cause.
3. Students may interrogate intermediate nodes within the visualization tree to establish alternative branches, analyzing parallel failure modes.

### Phase V: Deep Analysis & Academic Reporting
1. The student invokes the **Deep Analysis** subsystem, prompting the LLM to perform secondary synthesis:
   - **Further Exploration Inquiries**: Systemic blind spots warranting secondary audit.
   - **Data Collection Methodologies**: Empirical measurements, sensor telemetry, stakeholder interviews, and audit logs required to validate the hypothesis.
   - **Executive Diagnostic Summary**: A formal distillation of findings.
2. The student exports the persistent JSON session transcript and plain-text dossier for instructor evaluation.

---

## 4. Technical Architecture & System Specifications

### 4.1 Client-Side Component Structure
The laboratory platform is implemented as a dependency-free, zero-build Single Page Application (SPA) utilizing standardized ECMAScript 6+, semantic HTML5, and responsive CSS3:
- `index.html`: Declarative structure containing UI containers, status telemetry, and modal dialogue viewports.
- `styles.css`: Visual hierarchy, responsive grids, and accessibility-compliant contrast palettes.
- `app.js`: Encapsulated object-oriented runtime housing the `FiveWhysApp`, `OllamaIntegration`, and `LanguageComplexityAdjuster` classes.
- `tests.js`: Verification test harness evaluating serialization contracts, text simplification, thinking-trace sanitization, model filtration, and server probe mechanics.

### 4.2 Ollama Runtime Protocol & API Contracts
The client orchestrates communication with the local Ollama HTTP REST daemon:
1. **Server Active Verification (`GET /api/version`)**: Verifies that the local daemon is responsive and extracts semantic version metadata prior to session initialization.
2. **Model Registry & Capabilities Introspection (`GET /api/tags`)**: Retrieves locally cached models, parsing metadata and explicit `capabilities` vectors.
3. **Generative Model Filtration**: Automatically filters out non-generative, embedding-only architectures (e.g., `nomic-embed-text`, `bge-m3`, `bert`-based models) to prevent runtime invocation faults.
4. **Context Generation (`POST /api/generate`)**: Transmits structured prompts with `stream: false`, logging performance metrics (latency, token durations) in the persistent status bar.
5. **Reasoning-Trace Sanitization**: Intercepts outputs from modern reasoning architectures (e.g., DeepSeek-R1, QwQ) and removes `<think>...</think>` cognitive traces, ensuring downstream parsers receive clean interrogative statements.

### 4.3 Deterministic Fallback Mechanisms
To maintain instructional continuity during network interruptions or daemon latency, the runtime implements deterministic rule-based template fallbacks (`LanguageComplexityAdjuster.adjustText`) that construct structurally sound interrogatives should the local LLM become unresponsive.

---

## 5. Verification, Assessment & Grading Schema

Student analytical dossiers are evaluated across four pedagogical dimensions:

| Criterion | Weight | Scholarly Standard |
| :--- | :---: | :--- |
| **Causal Coherence & Linearity** | 30% | Clear progression from symptom to systemic cause without logical non-sequiturs or circular reasoning. |
| **Depth of Investigation** | 25% | Penetration past human error and superficial mechanics into governance, training, architecture, or policy deficits. |
| **Linguistic Precision** | 20% | Adherence to chosen CEFR register, conciseness of formulation, and semantic accuracy. |
| **Empirical Verification Plan** | 25% | Actionability and rigour of the data collection strategies generated during the Deep Analysis phase. |

---

## 6. Scholarly References

1. Ohno, T. (1988). *Toyota Production System: Beyond Large-Scale Production*. Productivity Press.
2. Council of Europe. (2001). *Common European Framework of Reference for Languages: Learning, Teaching, Assessment*. Cambridge University Press.
3. Spear, S., & Bowen, H. K. (1999). *Decoding the DNA of the Toyota Production System*. Harvard Business Review, 77(5), 96-108.
4. Vaswani, A., et al. (2017). *Attention Is All You Need*. Advances in Neural Information Processing Systems, 30.
5. Ollama Project. (2024). *Ollama: Get up and running with large language models locally*. https://ollama.com

---

*Last Updated: 2026-10-01*
