// Repository: https://github.com/pleabargain/five-whys
// Date: 2025-12-08
// Language Complexity Adjuster - CEFR Levels (A1-C2)
class LanguageComplexityAdjuster {
    constructor() {
        this.cefrLevels = {
            1: { code: 'A1', name: 'Beginner', complexity: 'very_simple' },
            2: { code: 'A2', name: 'Elementary', complexity: 'simple' },
            3: { code: 'B1', name: 'Intermediate', complexity: 'moderate' },
            4: { code: 'B2', name: 'Upper Intermediate', complexity: 'moderate_high' },
            5: { code: 'C1', name: 'Advanced', complexity: 'complex' },
            6: { code: 'C2', name: 'Proficient', complexity: 'very_complex' }
        };
        
        this.textTemplates = {
            initialQuestion: {
                very_simple: "What problem?",
                simple: "What problem do you have?",
                moderate: "What problem or issue would you like to analyze?",
                moderate_high: "What problem or issue would you like to analyze?",
                complex: "What problem or issue would you like to analyze?",
                very_complex: "What problem or issue would you like to analyze?"
            },
            whyQuestion: {
                very_simple: "Why {text}?",
                simple: "Why {text}?",
                moderate: "Why {text}?",
                moderate_high: "Why {text}?",
                complex: "Why {text}?",
                very_complex: "Why {text}?"
            },
            levelLabel: {
                very_simple: "Question {level} of {max}",
                simple: "Question {level} of {max}",
                moderate: "Why Level {level} of {max}",
                moderate_high: "Why Level {level} of {max}",
                complex: "Why Level {level} of {max}",
                very_complex: "Why Level {level} of {max}"
            },
            initialLabel: {
                very_simple: "Problem",
                simple: "Problem",
                moderate: "Initial Problem",
                moderate_high: "Initial Problem",
                complex: "Initial Problem",
                very_complex: "Initial Problem"
            },
            mcaPrompt: {
                very_simple: "Pick one:",
                simple: "Pick the most important:",
                moderate: "Select the most important part:",
                moderate_high: "Select the most important part:",
                complex: "Select the most important part:",
                very_complex: "Select the most important part:"
            },
            submitButton: {
                very_simple: "Send",
                simple: "Send Answer",
                moderate: "Submit Answer",
                moderate_high: "Submit Answer",
                complex: "Submit Answer",
                very_complex: "Submit Answer"
            },
            placeholder: {
                very_simple: "Type a concise description of your problem here",
                simple: "Type a concise description of your problem here",
                moderate: "Type a concise description of your problem here",
                moderate_high: "Type a concise description of your problem here",
                complex: "Type a concise description of your problem here",
                very_complex: "Type a concise description of your problem here"
            },
            alertNoAnswer: {
                very_simple: "Please type an answer.",
                simple: "Please type an answer.",
                moderate: "Please provide an answer before submitting.",
                moderate_high: "Please provide an answer before submitting.",
                complex: "Please provide an answer before submitting.",
                very_complex: "Please provide an answer before submitting."
            },
            completeMessage: {
                very_simple: "Done! Analysis complete.",
                simple: "Done! Analysis complete.",
                moderate: "Five Whys analysis complete!",
                moderate_high: "Five Whys analysis complete!",
                complex: "Five Whys analysis complete!",
                very_complex: "Five Whys analysis complete!"
            },
            resetConfirm: {
                very_simple: "Reset? All work will be lost.",
                simple: "Reset? All work will be lost.",
                moderate: "Are you sure you want to reset the analysis? All progress will be lost.",
                moderate_high: "Are you sure you want to reset the analysis? All progress will be lost.",
                complex: "Are you sure you want to reset the analysis? All progress will be lost.",
                very_complex: "Are you sure you want to reset the analysis? All progress will be lost."
            },
            newBranchPrompt: {
                very_simple: "New answer for: {text}",
                simple: "New answer for: {text}",
                moderate: "Generate a new \"why\" branch for: \"{text}\"\n\nEnter the new answer:",
                moderate_high: "Generate a new \"why\" branch for: \"{text}\"\n\nEnter the new answer:",
                complex: "Generate a new \"why\" branch for: \"{text}\"\n\nEnter the new answer:",
                very_complex: "Generate a new \"why\" branch for: \"{text}\"\n\nEnter the new answer:"
            },
            maxDepthReached: {
                very_simple: "Maximum depth reached.",
                simple: "Maximum depth reached.",
                moderate: "Maximum depth reached for this branch.",
                moderate_high: "Maximum depth reached for this branch.",
                complex: "Maximum depth reached for this branch.",
                very_complex: "Maximum depth reached for this branch."
            }
        };
    }

    getLevel(levelNumber) {
        return this.cefrLevels[levelNumber] || this.cefrLevels[3];
    }

    getComplexity(levelNumber) {
        return this.getLevel(levelNumber).complexity;
    }

    adjustText(templateKey, levelNumber, replacements = {}) {
        const complexity = this.getComplexity(levelNumber);
        const template = this.textTemplates[templateKey][complexity] || this.textTemplates[templateKey].moderate;
        
        let text = template;
        Object.keys(replacements).forEach(key => {
            text = text.replace(`{${key}}`, replacements[key]);
        });
        
        return text;
    }

    simplifyText(text, levelNumber) {
        const complexity = this.getComplexity(levelNumber);
        
        // For very simple and simple levels, simplify the text
        if (complexity === 'very_simple' || complexity === 'simple') {
            // Remove complex punctuation, shorten sentences
            text = text.replace(/[,;:]/g, '');
            text = text.replace(/\s+/g, ' ');
            // Break long sentences
            const sentences = text.split(/[.!?]+/);
            if (sentences.length > 1 && complexity === 'very_simple') {
                text = sentences[0].trim();
            }
        }
        
        return text;
    }
}

// Ollama API Integration
class OllamaIntegration {
    constructor() {
        this.baseUrl = 'http://localhost:11434';
        this.selectedModel = null;
        this.availableModels = [];
        this.lastResponseTime = null;
    }

    async fetchModels() {
        console.log('[Ollama] Fetching available models...');
        console.log(`[Ollama] Request URL: ${this.baseUrl}/api/tags`);
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            console.log(`[Ollama] Models response status: ${response.status} ${response.statusText}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[Ollama] Error fetching models: HTTP ${response.status}`, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('[Ollama] Models response data:', data);
            this.availableModels = data.models || [];
            const modelNames = this.availableModels.map(model => model.name);
            console.log(`[Ollama] Found ${modelNames.length} model(s):`, modelNames);
            return modelNames;
        } catch (error) {
            console.error('[Ollama] Error fetching models:', error);
            console.error('[Ollama] Error details:', {
                message: error.message,
                stack: error.stack,
                baseUrl: this.baseUrl
            });
            return [];
        }
    }

    async generate(prompt, model = null) {
        const modelToUse = model || this.selectedModel;
        if (!modelToUse) {
            console.error('[Ollama] Error: No model selected');
            throw new Error('No model selected');
        }

        const startTime = performance.now();
        console.log(`[Ollama] Starting generation with model: ${modelToUse}`);
        console.log(`[Ollama] Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);
        console.log(`[Ollama] Request URL: ${this.baseUrl}/api/generate`);

        try {
            const requestBody = {
                model: modelToUse,
                prompt: prompt,
                stream: false
            };
            console.log('[Ollama] Request body:', JSON.stringify(requestBody, null, 2));

            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log(`[Ollama] Response status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[Ollama] HTTP error response:`, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const endTime = performance.now();
            const responseTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds with 2 decimals

            console.log(`[Ollama] Response received in ${responseTime}s`);
            console.log(`[Ollama] Response preview: ${(data.response || '').substring(0, 200)}${(data.response || '').length > 200 ? '...' : ''}`);
            console.log(`[Ollama] Full response length: ${(data.response || '').length} characters`);

            // Store response time for status bar display
            this.lastResponseTime = responseTime;
            
            return { response: data.response || '', responseTime: responseTime };
        } catch (error) {
            console.error('[Ollama] Error generating:', error);
            console.error('[Ollama] Error details:', {
                message: error.message,
                stack: error.stack,
                model: modelToUse,
                promptLength: prompt.length
            });
            throw error;
        }
    }

    async generateWhyQuestion(previousAnswer, languageLevel, languageAdjuster) {
        const complexity = languageAdjuster.getComplexity(languageLevel);
        const levelInfo = languageAdjuster.getLevel(languageLevel);
        
        console.log(`[Ollama] Generating "Why" question for level ${languageLevel} (${levelInfo.code})`);
        console.log(`[Ollama] Previous answer: "${previousAnswer}"`);
        
        // Simplify input text for lower language levels
        let simplifiedAnswer = previousAnswer;
        if (complexity === 'very_simple' || complexity === 'simple') {
            simplifiedAnswer = languageAdjuster.simplifyText(previousAnswer, languageLevel);
            console.log(`[Ollama] Simplified input text for ${levelInfo.code}: "${simplifiedAnswer}"`);
        }
        
        // Build language level-specific instructions
        let languageInstructions = '';
        switch (levelInfo.code) {
            case 'A1':
                languageInstructions = `CRITICAL: This question MUST be written at A1 (Beginner) level:
- Use ONLY the most common 1000-2000 English words
- Maximum 8-10 words per question
- Use simple present tense or simple past tense only
- NO complex grammar (no passive voice, no conditionals, no subjunctive)
- NO technical terms, business jargon, or advanced vocabulary
- Use short, direct sentences
- Example good A1 question: "Why did this happen?" or "Why is this bad?"
- Example BAD (too complex): "Why are operational processes failing?" (too many complex words)`;
                break;
            case 'A2':
                languageInstructions = `CRITICAL: This question MUST be written at A2 (Elementary) level:
- Use common, everyday vocabulary (avoid technical terms)
- Maximum 12-15 words per question
- Use simple grammar structures
- Avoid complex business terminology
- Keep sentences short and clear
- Example good A2 question: "Why did the problem happen?" or "Why is this not working?"`;
                break;
            case 'B1':
                languageInstructions = `This question should be written at B1 (Intermediate) level:
- Use standard vocabulary appropriate for intermediate learners
- Clear, straightforward sentences
- Some business terminology is acceptable but keep it simple
- Example: "Why did this issue occur?" or "Why is this causing problems?"`;
                break;
            case 'B2':
                languageInstructions = `This question should be written at B2 (Upper Intermediate) level:
- Can use varied vocabulary and some business terminology
- Clear, well-structured sentences
- Example: "Why are these processes failing to meet requirements?"`;
                break;
            case 'C1':
                languageInstructions = `This question should be written at C1 (Advanced) level:
- Can use sophisticated vocabulary and business terminology
- Complex sentence structures are acceptable
- Example: "Why are current operational processes failing to consistently meet employee nutritional needs?"`;
                break;
            case 'C2':
                languageInstructions = `This question should be written at C2 (Proficient) level:
- Can use very sophisticated vocabulary and advanced business terminology
- Complex, nuanced sentence structures are acceptable
- Example: "Why are current operational processes failing to consistently meet employee nutritional needs?"`;
                break;
        }
        
        const prompt = `You are conducting a Five Whys root cause analysis.

Context: The previous response was: "${simplifiedAnswer}"

${languageInstructions}

Your task: Generate a single "why" question that:
1. Targets the most important cause in the previous response
2. Digs deeper to find the root cause
3. Follows the language level requirements EXACTLY above
4. Begins with "Why"
5. Is a complete question ending with "?"

Format: Return ONLY the question, nothing else. No explanations, numbering, or additional text.`;

        try {
            const result = await this.generate(prompt);
            console.log(`[Ollama] Raw question response: "${result.response}"`);
            
            // Clean up the response (remove quotes, extra text, etc.)
            let cleanedQuestion = result.response.trim();
            // Remove surrounding quotes if present
            cleanedQuestion = cleanedQuestion.replace(/^["']|["']$/g, '');
            // Extract just the question if there's extra text
            const questionMatch = cleanedQuestion.match(/Why[^?]*\?/);
            if (questionMatch) {
                cleanedQuestion = questionMatch[0];
            }
            // Ensure it starts with "Why"
            if (!cleanedQuestion.toLowerCase().startsWith('why')) {
                cleanedQuestion = `Why ${cleanedQuestion}`;
            }
            
            // Post-process to ensure language level compliance
            cleanedQuestion = this.enforceLanguageLevel(cleanedQuestion, levelInfo.code, languageAdjuster);
            
            // Post-process to ensure language level compliance
            cleanedQuestion = this.enforceLanguageLevel(cleanedQuestion, levelInfo.code, languageAdjuster);
            
            console.log(`[Ollama] Cleaned question: "${cleanedQuestion}"`);
            console.log(`[Ollama] Question generation completed in ${result.responseTime}s`);
            
            return { question: cleanedQuestion, responseTime: result.responseTime };
        } catch (error) {
            console.warn('[Ollama] Question generation failed, using fallback template');
            const fallbackQuestion = languageAdjuster.adjustText('whyQuestion', languageLevel, {
                text: previousAnswer
            });
            console.log(`[Ollama] Fallback question: "${fallbackQuestion}"`);
            return { question: fallbackQuestion };
        }
    }

    async extractKeyPhrases(text, languageLevel, languageAdjuster) {
        const complexity = languageAdjuster.getComplexity(languageLevel);
        const levelInfo = languageAdjuster.getLevel(languageLevel);
        
        console.log(`[Ollama] Extracting key phrases as "Why" questions`);
        console.log(`[Ollama] Input text: "${text}"`);
        console.log(`[Ollama] Language level: ${levelInfo.code} (${levelInfo.name})`);
        
        // Simplify input text for lower language levels
        let simplifiedText = text;
        if (complexity === 'very_simple' || complexity === 'simple') {
            simplifiedText = languageAdjuster.simplifyText(text, languageLevel);
            console.log(`[Ollama] Simplified input text for ${levelInfo.code}: "${simplifiedText}"`);
        }
        
        // Build language level-specific instructions
        let languageInstructions = '';
        switch (levelInfo.code) {
            case 'A1':
                languageInstructions = `CRITICAL: All questions MUST be written at A1 (Beginner) level:
- Use ONLY the most common 1000-2000 English words
- Maximum 8-10 words per question
- Use simple present tense or simple past tense only
- NO complex grammar (no passive voice, no conditionals, no subjunctive)
- NO technical terms, business jargon, or advanced vocabulary
- Use short, direct sentences
- Examples of good A1 questions: "Why did this happen?", "Why is this bad?", "Why did they do this?"
- Examples of BAD (too complex): "Why are operational processes failing?" (too many complex words), "Why is the individual feeling too lazy?" (too complex vocabulary)`;
                break;
            case 'A2':
                languageInstructions = `CRITICAL: All questions MUST be written at A2 (Elementary) level:
- Use common, everyday vocabulary (avoid technical terms)
- Maximum 12-15 words per question
- Use simple grammar structures
- Avoid complex business terminology
- Keep sentences short and clear
- Examples: "Why did the problem happen?", "Why is this not working?", "Why did they feel this way?"`;
                break;
            case 'B1':
                languageInstructions = `All questions should be written at B1 (Intermediate) level:
- Use standard vocabulary appropriate for intermediate learners
- Clear, straightforward sentences
- Some business terminology is acceptable but keep it simple
- Examples: "Why did this issue occur?", "Why is this causing problems?"`;
                break;
            case 'B2':
                languageInstructions = `All questions should be written at B2 (Upper Intermediate) level:
- Can use varied vocabulary and some business terminology
- Clear, well-structured sentences
- Examples: "Why are these processes failing to meet requirements?"`;
                break;
            case 'C1':
                languageInstructions = `All questions should be written at C1 (Advanced) level:
- Can use sophisticated vocabulary and business terminology
- Complex sentence structures are acceptable
- Examples: "Why are current operational processes failing to consistently meet employee nutritional needs?"`;
                break;
            case 'C2':
                languageInstructions = `All questions should be written at C2 (Proficient) level:
- Can use very sophisticated vocabulary and advanced business terminology
- Complex, nuanced sentence structures are acceptable`;
                break;
        }
        
        const prompt = `You are conducting a Five Whys root cause analysis. The user just provided this answer: "${simplifiedText}"

${languageInstructions}

Your task: Generate 2-4 proposed "Why" questions that explore different aspects of this answer. Each question should:
1. Focus on a different important aspect or causal factor from the answer
2. Dig deeper to find the root cause
3. Follow the language level requirements EXACTLY above
4. Begin with "Why"
5. Be a complete question ending with "?"

Format: Return ONLY the questions, one per line, no numbering, bullets, or additional text.`;

        try {
            const result = await this.generate(prompt);
            console.log(`[Ollama] Raw key phrases response:`, result.response);
            
            const questions = result.response
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => {
                    // Remove numbering, bullets, dashes
                    let cleaned = line.replace(/^[\d\-\*•\.\s]+/, '').trim();
                    // Remove quotes if present
                    cleaned = cleaned.replace(/^["']|["']$/g, '');
                    // Ensure it starts with "Why" (case-insensitive)
                    if (!cleaned.toLowerCase().startsWith('why')) {
                        cleaned = `Why ${cleaned}`;
                    }
                    // Ensure it ends with "?"
                    if (!cleaned.endsWith('?')) {
                        cleaned = cleaned + '?';
                    }
                    // Capitalize first letter
                    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
                    
                    // Enforce language level on each question
                    cleaned = this.enforceLanguageLevel(cleaned, levelInfo.code, languageAdjuster);
                    
                    return cleaned;
                })
                .filter(question => {
                    // Filter based on language level requirements
                    const wordCount = question.split(/\s+/).length;
                    if (levelInfo.code === 'A1') {
                        return wordCount <= 10 && question.length >= 10;
                    } else if (levelInfo.code === 'A2') {
                        return wordCount <= 15 && question.length >= 10;
                    } else {
                        return question.length >= 15 && question.length < 120;
                    }
                })
                .slice(0, 4);
            
            console.log(`[Ollama] Processed ${questions.length} "Why" question(s):`, questions);
            console.log(`[Ollama] Key phrase extraction completed in ${result.responseTime}s`);
            
            // If no questions passed filtering, use fallback
            if (questions.length === 0) {
                return this.fallbackKeyPhrases(simplifiedText, languageLevel, languageAdjuster);
            }
            
            return questions;
        } catch (error) {
            console.warn('[Ollama] Key phrase extraction failed, using fallback');
            const fallbackQuestions = this.fallbackKeyPhrases(simplifiedText, languageLevel, languageAdjuster);
            console.log(`[Ollama] Fallback questions:`, fallbackQuestions);
            return fallbackQuestions;
        }
    }

    enforceLanguageLevel(question, levelCode, languageAdjuster) {
        // If question is too complex for the level, simplify it
        if (levelCode === 'A1' || levelCode === 'A2') {
            // Count words
            const words = question.split(/\s+/);
            const wordCount = words.length;
            
            // Check for complex words (long words, technical terms, advanced vocabulary)
            const complexWords = words.filter(w => {
                const cleaned = w.toLowerCase().replace(/[^a-z]/g, '');
                return cleaned.length > 8 || 
                       /(process|operational|systematic|consistently|nutritional|requirements|implementation|individual|contributing|motivating|engaging|adequate|productivity|engagement|environment|conditions)/i.test(w);
            });
            
            // For A1, enforce strict limits
            if (levelCode === 'A1') {
                if (wordCount > 10 || complexWords.length > 0) {
                    // Simplify: extract key concept and create simple question
                    const simpleMatch = question.match(/Why\s+(.+?)\?/i);
                    if (simpleMatch) {
                        let concept = simpleMatch[1];
                        // Remove complex phrases and vocabulary
                        concept = concept.replace(/\b(operational|processes|failing|consistently|meet|employee|nutritional|needs|individual|feeling|lazy|complete|task|conditions|environment|contributing|motivating|engaging|adequate|systems|support|productivity|engagement)\b/gi, '');
                        concept = concept.replace(/\s+/g, ' ').trim();
                        // If we have something left, use it; otherwise use generic
                        if (concept.length > 3 && concept.length < 30) {
                            question = `Why ${concept}?`;
                        } else {
                            question = 'Why did this happen?';
                        }
                    } else {
                        question = 'Why did this happen?';
                    }
                }
            }
            
            // For A2, allow slightly more but still simplify
            if (levelCode === 'A2' && wordCount > 15) {
                const simpleMatch = question.match(/Why\s+(.+?)\?/i);
                if (simpleMatch) {
                    let concept = simpleMatch[1];
                    // Replace complex words with simpler alternatives
                    concept = concept.replace(/\boperational\b/gi, '');
                    concept = concept.replace(/\bprocesses\b/gi, 'things');
                    concept = concept.replace(/\bfailing\b/gi, 'not working');
                    concept = concept.replace(/\bconsistently\b/gi, '');
                    concept = concept.replace(/\bmeet\b/gi, 'help');
                    concept = concept.replace(/\bemployee\b/gi, 'people');
                    concept = concept.replace(/\bnutritional\b/gi, 'food');
                    concept = concept.replace(/\bneeds\b/gi, 'needs');
                    concept = concept.replace(/\bindividual\b/gi, 'person');
                    concept = concept.replace(/\bfeeling\b/gi, 'feel');
                    concept = concept.replace(/\blazy\b/gi, 'tired');
                    concept = concept.replace(/\bcomplete\b/gi, 'finish');
                    concept = concept.replace(/\btask\b/gi, 'work');
                    concept = concept.replace(/\bconditions\b/gi, 'things');
                    concept = concept.replace(/\benvironment\b/gi, 'place');
                    concept = concept.replace(/\bcontributing\b/gi, 'helping');
                    concept = concept.replace(/\bmotivating\b/gi, 'interesting');
                    concept = concept.replace(/\bengaging\b/gi, 'interesting');
                    concept = concept.replace(/\badequate\b/gi, 'enough');
                    concept = concept.replace(/\bsystems\b/gi, 'ways');
                    concept = concept.replace(/\bsupport\b/gi, 'help');
                    concept = concept.replace(/\bproductivity\b/gi, 'work');
                    concept = concept.replace(/\bengagement\b/gi, 'interest');
                    concept = concept.replace(/\s+/g, ' ').trim();
                    if (concept.length > 3) {
                        question = `Why ${concept}?`;
                    }
                }
            }
        }
        
        return question;
    }

    fallbackKeyPhrases(text, languageLevel = 3, languageAdjuster = null) {
        // Simple fallback extraction - convert to "Why" questions
        const levelInfo = languageAdjuster ? languageAdjuster.getLevel(languageLevel) : { code: 'B1', name: 'Intermediate' };
        const complexity = languageAdjuster ? languageAdjuster.getComplexity(languageLevel) : 'moderate';
        
        // Simplify text for lower levels
        let simplifiedText = text;
        if (languageAdjuster && (complexity === 'very_simple' || complexity === 'simple')) {
            simplifiedText = languageAdjuster.simplifyText(text, languageLevel);
        }
        
        const sentences = simplifiedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const questions = [];
        
        sentences.forEach(sentence => {
            const trimmed = sentence.trim();
            if (trimmed.length > 5) {
                // Convert to "Why" question format
                let question = trimmed;
                // Remove leading "because", "due to", etc.
                question = question.replace(/^(because|due to|since|as)\s+/i, '');
                // Capitalize first letter
                question = question.charAt(0).toUpperCase() + question.slice(1);
                // Ensure it's a question
                if (!question.endsWith('?')) {
                    question = `Why ${question.toLowerCase()}?`;
                } else if (!question.toLowerCase().startsWith('why')) {
                    question = `Why ${question.toLowerCase()}`;
                }
                
                // Enforce language level
                if (languageAdjuster) {
                    question = this.enforceLanguageLevel(question, levelInfo.code, languageAdjuster);
                }
                
                questions.push(question);
            }
        });

        // If no good questions from sentences, create from key words
        if (questions.length === 0) {
            const words = simplifiedText.split(/\s+/).filter(w => w.length > 2);
            if (words.length >= 2) {
                // For A1, use very simple questions
                if (levelInfo.code === 'A1') {
                    questions.push('Why did this happen?');
                    questions.push('Why is this bad?');
                    if (words.length > 0) {
                        const firstWord = words[0].toLowerCase();
                        if (firstWord.length <= 6) {
                            questions.push(`Why ${firstWord}?`);
                        }
                    }
                } else {
                    // Create questions from key words for other levels
                    const midPoint = Math.ceil(words.length / 2);
                    const firstPart = words.slice(0, midPoint).join(' ');
                    const secondPart = words.slice(midPoint).join(' ');
                    
                    let q1 = `Why ${firstPart}?`;
                    if (languageAdjuster) {
                        q1 = this.enforceLanguageLevel(q1, levelInfo.code, languageAdjuster);
                    }
                    questions.push(q1);
                    
                    if (secondPart.length > 3) {
                        let q2 = `Why ${secondPart}?`;
                        if (languageAdjuster) {
                            q2 = this.enforceLanguageLevel(q2, levelInfo.code, languageAdjuster);
                        }
                        questions.push(q2);
                    }
                }
            } else {
                // Very simple fallback
                if (levelInfo.code === 'A1') {
                    questions.push('Why did this happen?');
                } else {
                    let q = `Why ${simplifiedText}?`;
                    if (languageAdjuster) {
                        q = this.enforceLanguageLevel(q, levelInfo.code, languageAdjuster);
                    }
                    questions.push(q);
                }
            }
        }

        // Filter by language level requirements
        const filteredQuestions = questions.filter(q => {
            const wordCount = q.split(/\s+/).length;
            if (levelInfo.code === 'A1') {
                return wordCount <= 10;
            } else if (levelInfo.code === 'A2') {
                return wordCount <= 15;
            }
            return true;
        });

        return filteredQuestions.slice(0, 4); // Limit to 4 options
    }

    setModel(modelName) {
        this.selectedModel = modelName;
    }

    isAvailable() {
        return this.selectedModel !== null && this.selectedModel !== '';
    }
}

// Five Whys Analysis Application
class FiveWhysApp {
    constructor() {
        this.currentWhyLevel = 0;
        this.maxWhyLevel = 5;
        this.whyTree = [];
        this.qaLog = [];
        this.currentAnswer = '';
        this.selectedMCA = null;
        this.languageLevel = 3; // Default to B1 (Intermediate)
        this.languageAdjuster = new LanguageComplexityAdjuster();
        this.ollamaIntegration = new OllamaIntegration();
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeOllama();
    }

    initializeElements() {
        this.startBtn = document.getElementById('start-analysis');
        this.resetBtn = document.getElementById('reset-analysis');
        this.questionText = document.getElementById('current-question');
        this.questionNumber = document.getElementById('question-number');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-answer');
        this.mcaSection = document.getElementById('mca-section');
        this.mcaOptions = document.getElementById('mca-options');
        this.qaLogContainer = document.getElementById('qa-log');
        this.exportBtn = document.getElementById('export-log');
        this.answerSection = document.getElementById('answer-section');
        this.languageSlider = document.getElementById('language-level-slider');
        this.languageDisplay = document.getElementById('language-level-display');
        this.mcaPrompt = this.mcaSection.querySelector('h3');
        this.ollamaModelSelect = document.getElementById('ollama-model-select');
        this.refreshModelsBtn = document.getElementById('refresh-models');
        this.ollamaStatus = document.getElementById('ollama-status');
        this.statusBar = document.getElementById('status-bar');
        this.statusModel = document.getElementById('status-model');
        this.statusTime = document.getElementById('status-time');
        this.examplesSection = document.getElementById('examples-section');
        this.examplesGrid = document.getElementById('examples-grid');
        this.problemStatementInput = null; // Will be created dynamically
        this.saveBtn = document.getElementById('save-analysis');
        this.loadBtn = document.getElementById('load-analysis');
        this.loadFileInput = document.getElementById('load-file-input');
        this.deepAnalysisBtn = document.getElementById('deep-analysis');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startAnalysis());
        this.resetBtn.addEventListener('click', () => this.resetAnalysis());
        this.submitBtn.addEventListener('click', () => this.handleAnswerSubmit());
        this.exportBtn.addEventListener('click', () => this.exportQALog());
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleAnswerSubmit();
            }
        });
        
        // Language level slider
        this.languageSlider.addEventListener('input', (e) => {
            this.languageLevel = parseInt(e.target.value);
            this.updateLanguageDisplay();
            this.updateUITexts();
        });
        
        // Ollama model selection
        this.ollamaModelSelect.addEventListener('change', (e) => {
            this.ollamaIntegration.setModel(e.target.value);
            this.updateOllamaStatus();
        });
        
        this.refreshModelsBtn.addEventListener('click', () => {
            this.loadOllamaModels();
        });
        
        // Save/Load functionality
        this.saveBtn.addEventListener('click', () => this.saveAnalysis());
        this.loadBtn.addEventListener('click', () => this.loadFileInput.click());
        this.loadFileInput.addEventListener('change', (e) => this.handleFileLoad(e));
        this.deepAnalysisBtn.addEventListener('click', () => this.performDeepAnalysis());
        
        // Initialize language display
        this.updateLanguageDisplay();
        this.updateUITexts();
        
        // Initialize examples library
        this.initializeExamples();
    }

    initializeExamples() {
        const examples = [
            {
                title: 'Relationships',
                problem: 'My friend stopped responding to my messages',
                whys: [
                    'Why did your friend stop responding?',
                    'Why did they feel overwhelmed?',
                    'Why did they not communicate their feelings?',
                    'Why did they lack communication skills?',
                    'Why were communication skills never taught or practiced?'
                ],
                answers: [
                    'They felt overwhelmed by the frequency of messages',
                    'They didn\'t know how to express their need for space',
                    'They never learned healthy communication boundaries',
                    'Their family environment didn\'t model open communication',
                    'Root Cause: Lack of communication education in formative years'
                ]
            },
            {
                title: 'Work',
                problem: 'Our team missed the project deadline',
                whys: [
                    'Why did the team miss the deadline?',
                    'Why were tasks not completed on time?',
                    'Why was the timeline unrealistic?',
                    'Why wasn\'t the timeline validated?',
                    'Why was there no process for timeline review?'
                ],
                answers: [
                    'Tasks took longer than estimated',
                    'The initial timeline didn\'t account for complexity',
                    'No one reviewed the timeline with the team',
                    'There was no established process for timeline validation',
                    'Root Cause: Missing project planning process'
                ]
            },
            {
                title: 'Entertainment',
                problem: 'I can\'t find time to watch my favorite shows',
                whys: [
                    'Why can\'t you find time to watch shows?',
                    'Why are your evenings so busy?',
                    'Why do you take on so many commitments?',
                    'Why do you have trouble saying no?',
                    'Why do you fear disappointing others?'
                ],
                answers: [
                    'My evenings are filled with other commitments',
                    'I keep saying yes to social invitations and tasks',
                    'I have difficulty declining requests',
                    'I worry about what others will think if I say no',
                    'Root Cause: Need for external validation overriding personal priorities'
                ]
            }
        ];

        examples.forEach((example, index) => {
            const exampleCard = document.createElement('div');
            exampleCard.className = 'example-card';
            exampleCard.innerHTML = `
                <h3>${example.title}</h3>
                <p class="example-problem"><strong>Problem:</strong> ${example.problem}</p>
                <button class="btn btn-small view-example" data-index="${index}">View Full Analysis</button>
            `;
            
            const viewBtn = exampleCard.querySelector('.view-example');
            viewBtn.addEventListener('click', () => this.showExampleDetails(example));
            
            this.examplesGrid.appendChild(exampleCard);
        });
    }

    showExampleDetails(example) {
        const modal = document.createElement('div');
        modal.className = 'example-modal';
        modal.innerHTML = `
            <div class="example-modal-content">
                <span class="example-modal-close">&times;</span>
                <h2>${example.title} - Five Whys Analysis</h2>
                <div class="example-analysis">
                    <p class="example-problem-statement"><strong>Problem Statement:</strong> ${example.problem}</p>
                    ${example.whys.map((why, i) => `
                        <div class="example-qa">
                            <p class="example-q"><strong>Why ${i + 1}:</strong> ${why}</p>
                            <p class="example-a"><strong>Answer:</strong> ${example.answers[i]}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.example-modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    async initializeOllama() {
        await this.loadOllamaModels();
    }

    async loadOllamaModels() {
        this.ollamaStatus.textContent = 'Loading...';
        this.ollamaStatus.className = 'ollama-status loading';
        
        try {
            const models = await this.ollamaIntegration.fetchModels();
            
            // Clear existing options
            this.ollamaModelSelect.innerHTML = '';
            
            if (models.length === 0) {
                this.ollamaModelSelect.innerHTML = '<option value="">No models found. Is Ollama running?</option>';
                this.ollamaStatus.textContent = 'Not connected';
                this.ollamaStatus.className = 'ollama-status error';
            } else {
                // Add "None" option
                const noneOption = document.createElement('option');
                noneOption.value = '';
                noneOption.textContent = 'None (use simple templates)';
                this.ollamaModelSelect.appendChild(noneOption);
                
                // Add model options
                models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    this.ollamaModelSelect.appendChild(option);
                });
                
                this.ollamaStatus.textContent = `${models.length} model(s) available`;
                this.ollamaStatus.className = 'ollama-status success';
            }
        } catch (error) {
            this.ollamaModelSelect.innerHTML = '<option value="">Error loading models</option>';
            this.ollamaStatus.textContent = 'Connection error';
            this.ollamaStatus.className = 'ollama-status error';
            console.error('Failed to load Ollama models:', error);
        }
    }

    updateOllamaStatus() {
        if (this.ollamaIntegration.isAvailable()) {
            this.ollamaStatus.textContent = `Using: ${this.ollamaIntegration.selectedModel}`;
            this.ollamaStatus.className = 'ollama-status success';
            this.updateStatusBar();
        } else {
            this.ollamaStatus.textContent = 'No model selected';
            this.ollamaStatus.className = 'ollama-status error';
            this.updateStatusBar();
        }
    }

    updateStatusBar() {
        if (this.ollamaIntegration.isAvailable()) {
            this.statusModel.textContent = `Model: ${this.ollamaIntegration.selectedModel}`;
            if (this.ollamaIntegration.lastResponseTime) {
                this.statusTime.textContent = `Response Time: ${this.ollamaIntegration.lastResponseTime}s`;
            } else {
                this.statusTime.textContent = 'Ready';
            }
            this.statusBar.classList.remove('hidden');
        } else {
            this.statusBar.classList.add('hidden');
        }
    }

    updateLanguageDisplay() {
        const level = this.languageAdjuster.getLevel(this.languageLevel);
        this.languageDisplay.textContent = `${level.code} (${level.name})`;
    }

    updateUITexts() {
        // Update button text
        this.submitBtn.textContent = this.languageAdjuster.adjustText('submitButton', this.languageLevel);
        
        // Update placeholder
        this.answerInput.placeholder = this.languageAdjuster.adjustText('placeholder', this.languageLevel);
        
        // Update MCA prompt if visible
        if (this.mcaPrompt) {
            this.mcaPrompt.textContent = this.languageAdjuster.adjustText('mcaPrompt', this.languageLevel);
        }
    }

    startAnalysis() {
        // Validate Ollama is available
        if (!this.ollamaIntegration.isAvailable()) {
            alert('Please select an Ollama model before starting the analysis. Ollama is required for this application.');
            return;
        }

        // Hide examples section
        this.examplesSection.classList.add('hidden');

        // Show problem statement input
        this.showProblemStatementInput();
    }

    showProblemStatementInput() {
        const problemSection = document.createElement('div');
        problemSection.id = 'problem-statement-section';
        problemSection.className = 'problem-statement-section';
        problemSection.innerHTML = `
            <h2>Enter Your Problem Statement</h2>
            <p>Describe the problem you want to analyze using the Five Whys methodology.</p>
            <textarea id="problem-statement-input" class="problem-statement-input" placeholder="Type your problem here" rows="3"></textarea>
            <button id="submit-problem" class="btn btn-primary">Start Analysis</button>
        `;

        // Insert before question section
        const questionSection = document.getElementById('question-section');
        questionSection.parentNode.insertBefore(problemSection, questionSection);

        this.problemStatementInput = document.getElementById('problem-statement-input');
        const submitProblemBtn = document.getElementById('submit-problem');

        submitProblemBtn.addEventListener('click', () => this.submitProblemStatement());
        this.problemStatementInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.submitProblemStatement();
            }
        });

        this.problemStatementInput.focus();
    }

    submitProblemStatement() {
        const problemStatement = this.problemStatementInput.value.trim();
        
        if (!problemStatement) {
            alert(this.languageAdjuster.adjustText('alertNoAnswer', this.languageLevel));
            return;
        }

        // Store problem statement
        this.problemStatement = problemStatement;

        // Remove problem statement section
        const problemSection = document.getElementById('problem-statement-section');
        if (problemSection) {
            problemSection.remove();
        }

        // Initialize analysis
        this.currentWhyLevel = 0;
        this.whyTree = [];
        this.qaLog = [];
        this.currentAnswer = '';
        this.selectedMCA = null;

        this.startBtn.classList.add('hidden');
        this.resetBtn.classList.remove('hidden');
        this.answerSection.classList.remove('hidden');
        this.mcaSection.classList.add('hidden');

        // Store problem in tree
        this.whyTree.push({
            level: 0,
            problem: problemStatement,
            children: []
        });

        // Ask first why question
        this.askFirstWhy();
    }

    async askFirstWhy() {
        this.currentWhyLevel = 1;
        
        // Use Ollama if available to generate first question respecting language level
        if (this.ollamaIntegration.isAvailable()) {
            try {
                // Simplify problem statement for lower levels
                let problemText = this.problemStatement;
                if (this.languageAdjuster.getComplexity(this.languageLevel) === 'very_simple' || 
                    this.languageAdjuster.getComplexity(this.languageLevel) === 'simple') {
                    problemText = this.languageAdjuster.simplifyText(this.problemStatement, this.languageLevel);
                }
                
                const result = await this.ollamaIntegration.generateWhyQuestion(
                    problemText,
                    this.languageLevel,
                    this.languageAdjuster
                );
                const question = result.question || result;
                this.displayQuestion(question, 1);
                this.updateStatusBar();
            } catch (error) {
                console.error('Ollama question generation failed, using template:', error);
                // Fallback to simple template
                const simplifiedProblem = this.languageAdjuster.simplifyText(this.problemStatement, this.languageLevel);
                const question = this.languageAdjuster.adjustText('whyQuestion', this.languageLevel, {
                    text: simplifiedProblem
                });
                this.displayQuestion(question, 1);
            }
        } else {
            // Use simple template
            const simplifiedProblem = this.languageAdjuster.simplifyText(this.problemStatement, this.languageLevel);
            const question = this.languageAdjuster.adjustText('whyQuestion', this.languageLevel, {
                text: simplifiedProblem
            });
            this.displayQuestion(question, 1);
        }
        
        this.answerInput.value = '';
        this.answerInput.focus();
        this.updateStatusBar();
    }

    displayQuestion(question, level) {
        this.questionText.textContent = question;
        if (level > 0) {
            this.questionNumber.textContent = this.languageAdjuster.adjustText('levelLabel', this.languageLevel, {
                level: level,
                max: this.maxWhyLevel
            });
        } else {
            this.questionNumber.textContent = this.languageAdjuster.adjustText('initialLabel', this.languageLevel);
        }
    }

    async handleAnswerSubmit() {
        const answer = this.answerInput.value.trim();
        
        if (!answer) {
            alert(this.languageAdjuster.adjustText('alertNoAnswer', this.languageLevel));
            return;
        }

        // Log Q&A
        const qaEntry = {
            level: this.currentWhyLevel,
            question: this.questionText.textContent,
            answer: answer,
            timestamp: new Date().toISOString()
        };
        this.qaLog.push(qaEntry);
        this.updateQALog();

        // Store answer in tree
        if (this.currentWhyLevel === 0) {
            this.whyTree.push({
                level: 0,
                problem: answer,
                children: []
            });
        } else {
            // Find the current branch and add answer
            const currentBranch = this.getCurrentBranch();
            if (currentBranch) {
                currentBranch.children.push({
                    level: this.currentWhyLevel,
                    answer: answer,
                    children: []
                });
            }
        }

        this.currentAnswer = answer;

        // Clear input
        this.answerInput.value = '';

        // Check if we've reached max level
        if (this.currentWhyLevel >= this.maxWhyLevel) {
            this.completeAnalysis();
            return;
        }

        // Extract important parts and show MCA
        await this.extractImportantParts(answer);
    }

    async extractImportantParts(answer) {
        let importantParts;
        
        // Use Ollama if available, otherwise use simple extraction
        if (this.ollamaIntegration.isAvailable()) {
            try {
                importantParts = await this.ollamaIntegration.extractKeyPhrases(
                    answer, 
                    this.languageLevel, 
                    this.languageAdjuster
                );
                this.updateStatusBar();
            } catch (error) {
                console.error('Ollama extraction failed, using fallback:', error);
                importantParts = this.extractKeyPhrases(answer, this.languageLevel, this.languageAdjuster);
            }
        } else {
            importantParts = this.extractKeyPhrases(answer, this.languageLevel, this.languageAdjuster);
        }
        
        if (importantParts.length > 1) {
            this.showMCA(importantParts);
        } else {
            // If only one important part, proceed directly
            this.currentWhyLevel++;
            await this.askNextWhy(answer);
        }
    }

    extractKeyPhrases(text) {
        // Simple extraction: convert to "Why" questions
        // Fallback method when Ollama is not available
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const questions = [];
        
        sentences.forEach(sentence => {
            const trimmed = sentence.trim();
            if (trimmed.length > 10) {
                // Convert to "Why" question format
                let question = trimmed;
                // Remove leading "because", "due to", etc.
                question = question.replace(/^(because|due to|since|as|the|a|an)\s+/i, '');
                // Capitalize first letter
                question = question.charAt(0).toUpperCase() + question.slice(1);
                // Ensure it's a question
                if (!question.endsWith('?')) {
                    question = `Why ${question.toLowerCase()}?`;
                } else if (!question.toLowerCase().startsWith('why')) {
                    question = `Why ${question.toLowerCase()}`;
                }
                questions.push(question);
            }
        });

        // If no good questions from sentences, create from key words
        if (questions.length === 0) {
            const words = text.split(/\s+/).filter(w => w.length > 3);
            if (words.length >= 2) {
                // Create questions from key words
                const midPoint = Math.ceil(words.length / 2);
                const firstPart = words.slice(0, midPoint).join(' ');
                const secondPart = words.slice(midPoint).join(' ');
                
                questions.push(`Why ${firstPart}?`);
                if (secondPart.length > 3) {
                    questions.push(`Why ${secondPart}?`);
                }
            } else {
                questions.push(`Why ${text}?`);
            }
        }

        return questions.slice(0, 4); // Limit to 4 options
    }

    showMCA(parts) {
        this.mcaSection.classList.remove('hidden');
        this.mcaOptions.innerHTML = '';
        
        // Update MCA prompt text
        this.mcaPrompt.textContent = this.languageAdjuster.adjustText('mcaPrompt', this.languageLevel);
        
        parts.forEach((part, index) => {
            const option = document.createElement('button');
            option.className = 'mca-option';
            // Parts are now "Why" questions, display them as-is (they're already formatted)
            option.textContent = part;
            option.addEventListener('click', () => this.selectMCA(part, option));
            this.mcaOptions.appendChild(option);
        });
    }

    selectMCA(part, element) {
        // Remove previous selection
        document.querySelectorAll('.mca-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        element.classList.add('selected');
        this.selectedMCA = part;
        
        // Extract the core concept from the "Why" question for the next question
        // Remove "Why" and "?" to get the focus point
        let focusText = part.replace(/^Why\s+/i, '').replace(/\?$/, '').trim();
        
        // Auto-proceed after selection
        setTimeout(async () => {
            this.currentWhyLevel++;
            // Use the extracted focus text to generate the next "why" question
            await this.askNextWhy(focusText);
            this.mcaSection.classList.add('hidden');
            this.selectedMCA = null;
        }, 500);
    }

    async askNextWhy(previousAnswer) {
        let question;
        let responseTime = null;
        
        // Use Ollama if available, otherwise use template
        if (this.ollamaIntegration.isAvailable()) {
            try {
                const result = await this.ollamaIntegration.generateWhyQuestion(
                    previousAnswer,
                    this.languageLevel,
                    this.languageAdjuster
                );
                question = result.question || result;
                responseTime = result.responseTime || this.ollamaIntegration.lastResponseTime;
                this.updateStatusBar();
            } catch (error) {
                console.error('Ollama question generation failed, using template:', error);
                // Fallback to template
                const simplifiedAnswer = this.languageAdjuster.simplifyText(previousAnswer, this.languageLevel);
                question = this.languageAdjuster.adjustText('whyQuestion', this.languageLevel, {
                    text: simplifiedAnswer
                });
            }
        } else {
            // Use simple template
            const simplifiedAnswer = this.languageAdjuster.simplifyText(previousAnswer, this.languageLevel);
            question = this.languageAdjuster.adjustText('whyQuestion', this.languageLevel, {
                text: simplifiedAnswer
            });
        }
        
        this.displayQuestion(question, this.currentWhyLevel);
        this.answerInput.focus();
    }

    getCurrentBranch() {
        // Navigate to the current branch in the tree
        let branch = this.whyTree[this.whyTree.length - 1];
        let level = 0;
        
        while (level < this.currentWhyLevel && branch && branch.children) {
            branch = branch.children[branch.children.length - 1];
            level++;
        }
        
        return branch;
    }

    completeAnalysis() {
        this.answerSection.classList.add('hidden');
        
        alert(this.languageAdjuster.adjustText('completeMessage', this.languageLevel));
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    generateNewWhy(node) {
        if (node.level >= this.maxWhyLevel) {
            alert(this.languageAdjuster.adjustText('maxDepthReached', this.languageLevel));
            return;
        }

        const promptText = this.languageAdjuster.adjustText('newBranchPrompt', this.languageLevel, {
            text: node.text
        });
        const newWhy = prompt(promptText);
        
        if (newWhy && newWhy.trim()) {
            // Add new branch
            if (!node.branch.children) {
                node.branch.children = [];
            }
            
            node.branch.children.push({
                level: node.level + 1,
                answer: newWhy.trim(),
                children: []
            });

            // Log the new Q&A
            const qaEntry = {
                level: node.level + 1,
                question: `Why ${node.text}? (New Branch)`,
                answer: newWhy.trim(),
                timestamp: new Date().toISOString(),
                isNewBranch: true
            };
            this.qaLog.push(qaEntry);
            this.updateQALog();
        }
    }

    updateQALog() {
        this.qaLogContainer.innerHTML = '';
        
        if (this.qaLog.length === 0) {
            this.qaLogContainer.innerHTML = '<p style="color: #666; text-align: center;">No questions answered yet.</p>';
            return;
        }

        this.qaLog.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'qa-entry';
            
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.textContent = `Q${entry.level > 0 ? entry.level : '0'}: ${entry.question}`;
            
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer';
            answerDiv.textContent = `A: ${entry.answer}`;
            
            const timestampDiv = document.createElement('div');
            timestampDiv.style.cssText = 'font-size: 0.85em; color: #666; margin-top: 5px;';
            timestampDiv.textContent = new Date(entry.timestamp).toLocaleString();
            
            entryDiv.appendChild(questionDiv);
            entryDiv.appendChild(answerDiv);
            entryDiv.appendChild(timestampDiv);
            
            this.qaLogContainer.appendChild(entryDiv);
        });

        // Scroll to bottom
        this.qaLogContainer.scrollTop = this.qaLogContainer.scrollHeight;
    }

    async performDeepAnalysis() {
        if (this.qaLog.length === 0) {
            alert('No analysis data available. Please complete an analysis first.');
            return;
        }

        if (!this.ollamaIntegration.isAvailable()) {
            alert('Ollama is required for Deep Analysis. Please select a model first.');
            return;
        }

        // Show loading state
        this.deepAnalysisBtn.disabled = true;
        this.deepAnalysisBtn.textContent = 'Analyzing...';

        try {
            // Build comprehensive prompt from Q&A log
            const qaSummary = this.qaLog.map((entry, index) => {
                return `Level ${entry.level}: ${entry.question}\nAnswer: ${entry.answer}`;
            }).join('\n\n');

            const problemContext = this.problemStatement ? `Problem Statement: ${this.problemStatement}\n\n` : '';
            
            const levelInfo = this.languageAdjuster.getLevel(this.languageLevel);
            
            const prompt = `You are an advanced business analyst conducting a deep root cause analysis. 

${problemContext}The following Five Whys analysis has been completed:

${qaSummary}

Your task is to generate an ADVANCED ANALYSIS that includes:

1. **Further Exploration Questions**: Generate 3-5 additional "why" questions that could dig deeper into areas that might need more investigation. These should explore:
   - Potential systemic issues not yet uncovered
   - Alternative causal factors
   - Deeper root causes that may have been missed
   - Related processes or systems that could be contributing

2. **Data Collection Approaches**: Suggest 3-5 specific approaches or methods to gather more data to validate or expand on the findings. Consider:
   - What data would help confirm the root cause?
   - What metrics or measurements would be useful?
   - What stakeholders should be consulted?
   - What processes should be observed or analyzed?
   - What historical data should be reviewed?

3. **Analysis Summary**: Provide a brief summary (2-3 sentences) of the key insights from the analysis and what areas warrant further investigation.

Format your response as follows:

=== FURTHER EXPLORATION QUESTIONS ===
[Your questions here, one per line]

=== DATA COLLECTION APPROACHES ===
[Your approaches here, one per line]

=== ANALYSIS SUMMARY ===
[Your summary here]

Use professional business analyst terminology appropriate for ${levelInfo.code} (${levelInfo.name}) language level.`;

            console.log('[Deep Analysis] Starting deep analysis generation...');
            console.log('[Deep Analysis] Using model:', this.ollamaIntegration.selectedModel);
            // Use the currently selected model, not the saved one
            const result = await this.ollamaIntegration.generate(prompt, this.ollamaIntegration.selectedModel);
            const analysis = result.response;
            
            // Display the analysis in a modal
            this.displayDeepAnalysis(analysis, levelInfo);
            this.updateStatusBar();
            
        } catch (error) {
            console.error('[Deep Analysis] Error:', error);
            alert('Error generating deep analysis. Please try again.');
        } finally {
            // Reset button state
            this.deepAnalysisBtn.disabled = false;
            this.deepAnalysisBtn.textContent = 'Deep Analysis';
        }
    }

    displayDeepAnalysis(analysis, levelInfo) {
        // Create or get modal
        let modal = document.getElementById('deep-analysis-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'deep-analysis-modal';
            modal.className = 'deep-analysis-modal';
            document.body.appendChild(modal);
        }
        
        // Build language level indicator text
        const languageLevelText = `Language Level: ${levelInfo.code} (${levelInfo.name})`;

        // Parse the analysis into sections
        const sections = {
            questions: '',
            approaches: '',
            summary: ''
        };

        const lines = analysis.split('\n');
        let currentSection = null;
        let content = [];

        for (const line of lines) {
            if (line.includes('FURTHER EXPLORATION QUESTIONS')) {
                currentSection = 'questions';
                content = [];
            } else if (line.includes('DATA COLLECTION APPROACHES')) {
                if (currentSection === 'questions') {
                    sections.questions = content.join('\n').trim();
                }
                currentSection = 'approaches';
                content = [];
            } else if (line.includes('ANALYSIS SUMMARY')) {
                if (currentSection === 'approaches') {
                    sections.approaches = content.join('\n').trim();
                }
                currentSection = 'summary';
                content = [];
            } else if (currentSection && line.trim() && !line.match(/^===/)) {
                content.push(line.trim());
            }
        }

        // Capture last section
        if (currentSection === 'summary') {
            sections.summary = content.join('\n').trim();
        } else if (currentSection === 'approaches') {
            sections.approaches = content.join('\n').trim();
        } else if (currentSection === 'questions') {
            sections.questions = content.join('\n').trim();
        }

        // Build full analysis text for clipboard (includes language level)
        const fullAnalysisText = `DEEP ANALYSIS REPORT
Language Level: ${levelInfo.code} (${levelInfo.name})
Generated: ${new Date().toLocaleString()}

${analysis}`;

        // Build modal content
        modal.innerHTML = `
            <div class="deep-analysis-modal-content">
                <div class="deep-analysis-modal-header">
                    <div>
                        <h2>Deep Analysis Results</h2>
                        <div class="deep-analysis-language-level">${languageLevelText}</div>
                    </div>
                    <button class="deep-analysis-close" onclick="this.closest('.deep-analysis-modal').style.display='none'">&times;</button>
                </div>
                <div class="deep-analysis-modal-body">
                    ${sections.questions ? `
                        <div class="deep-analysis-section">
                            <h3>Further Exploration Questions</h3>
                            <div class="deep-analysis-text">${this.formatAnalysisText(sections.questions)}</div>
                        </div>
                    ` : ''}
                    ${sections.approaches ? `
                        <div class="deep-analysis-section">
                            <h3>Data Collection Approaches</h3>
                            <div class="deep-analysis-text">${this.formatAnalysisText(sections.approaches)}</div>
                        </div>
                    ` : ''}
                    ${sections.summary ? `
                        <div class="deep-analysis-section">
                            <h3>Analysis Summary</h3>
                            <div class="deep-analysis-text">${this.formatAnalysisText(sections.summary)}</div>
                        </div>
                    ` : ''}
                    ${!sections.questions && !sections.approaches && !sections.summary ? `
                        <div class="deep-analysis-section">
                            <h3>Deep Analysis</h3>
                            <div class="deep-analysis-text">${this.formatAnalysisText(analysis)}</div>
                        </div>
                    ` : ''}
                </div>
                <div class="deep-analysis-modal-footer">
                    <button class="btn btn-primary" onclick="navigator.clipboard.writeText(\`${this.escapeForClipboard(fullAnalysisText)}\`).then(() => alert('Deep analysis copied to clipboard!'))">Copy to Clipboard</button>
                    <button class="btn btn-secondary" onclick="this.closest('.deep-analysis-modal').style.display='none'">Close</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    formatAnalysisText(text) {
        // Convert plain text to formatted HTML
        return text
            .split('\n')
            .map(line => {
                const trimmed = line.trim();
                if (!trimmed) return '<br>';
                // Check if it's a numbered list item
                if (trimmed.match(/^\d+[\.\)]\s/)) {
                    return `<p class="analysis-item">${trimmed}</p>`;
                }
                // Check if it's a bullet point
                if (trimmed.match(/^[-•*]\s/)) {
                    return `<p class="analysis-item">${trimmed}</p>`;
                }
                // Regular paragraph
                return `<p>${trimmed}</p>`;
            })
            .join('');
    }

    escapeForClipboard(text) {
        // Escape backticks and other special characters for use in template literals
        return text.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    }

    exportQALog() {
        // Format as plain text for clipboard export
        let text = 'FIVE WHYS ANALYSIS\n';
        text += '==================\n\n';
        
        if (this.problemStatement) {
            text += `Problem Statement: ${this.problemStatement}\n\n`;
        }
        
        text += 'Question & Answer Log:\n';
        text += '---------------------\n\n';
        
        this.qaLog.forEach((entry, index) => {
            text += `Q${entry.level}: ${entry.question}\n`;
            text += `A${entry.level}: ${entry.answer}\n`;
            if (entry.timestamp) {
                const date = new Date(entry.timestamp);
                text += `Time: ${date.toLocaleString()}\n`;
            }
            text += '\n';
        });
        
        text += '\n--- End of Analysis ---\n';
        
        // Copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Analysis copied to clipboard! You can now paste it into your email.');
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
            // Fallback: show text in alert for manual copy
            alert('Please copy the following text:\n\n' + text.substring(0, 500) + '...\n\n(Full text in console)');
            console.log(text);
        });
    }

    // Save analysis to JSON file
    saveAnalysis() {
        if (this.whyTree.length === 0 && this.qaLog.length === 0) {
            alert('No analysis data to save. Please complete an analysis first.');
            return;
        }

        // Ensure data is clean and valid before creating save object
        const cleanWhyTree = this.cleanWhyTree(this.whyTree);
        const cleanQaLog = this.cleanQaLog(this.qaLog);

        const saveData = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            problemStatement: this.problemStatement || null,
            currentWhyLevel: typeof this.currentWhyLevel === 'number' ? this.currentWhyLevel : 0,
            maxWhyLevel: typeof this.maxWhyLevel === 'number' ? this.maxWhyLevel : 5,
            languageLevel: typeof this.languageLevel === 'number' ? this.languageLevel : 3,
            selectedModel: this.ollamaIntegration?.selectedModel || null,
            whyTree: cleanWhyTree,
            qaLog: cleanQaLog
        };

        // Validate data before saving
        console.log('[Save] Validating save data...');
        if (!this.validateSaveData(saveData)) {
            console.error('[Save] Validation failed. Save data:', JSON.stringify(saveData, null, 2));
            alert('Error: Data validation failed. Cannot save. Check console for details.');
            return;
        }

        console.log('[Save] Validation passed. Saving...');

        const jsonString = JSON.stringify(saveData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `five-whys-analysis-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Analysis saved successfully!');
    }

    // Clean whyTree to ensure valid structure
    cleanWhyTree(whyTree) {
        if (!Array.isArray(whyTree)) {
            console.warn('[Clean] whyTree is not an array, returning empty array');
            return [];
        }
        
        return whyTree.map(branch => {
            if (!branch || typeof branch !== 'object') {
                console.warn('[Clean] Invalid branch found, skipping');
                return null;
            }
            
            const cleaned = {
                level: typeof branch.level === 'number' ? branch.level : 0
            };
            
            // Ensure either problem or answer exists
            if (branch.problem) {
                cleaned.problem = String(branch.problem).trim();
            }
            if (branch.answer) {
                cleaned.answer = String(branch.answer).trim();
            }
            
            // If neither exists, skip this branch
            if (!cleaned.problem && !cleaned.answer) {
                console.warn('[Clean] Branch has neither problem nor answer, skipping');
                return null;
            }
            
            // Recursively clean children
            if (branch.children && Array.isArray(branch.children)) {
                const cleanedChildren = this.cleanWhyTree(branch.children).filter(c => c !== null);
                if (cleanedChildren.length > 0) {
                    cleaned.children = cleanedChildren;
                }
            } else {
                cleaned.children = [];
            }
            
            return cleaned;
        }).filter(branch => branch !== null);
    }

    // Clean qaLog to ensure valid structure
    cleanQaLog(qaLog) {
        if (!Array.isArray(qaLog)) {
            console.warn('[Clean] qaLog is not an array, returning empty array');
            return [];
        }
        
        return qaLog.map((entry, index) => {
            if (!entry || typeof entry !== 'object') {
                console.warn(`[Clean] Invalid qaLog entry at index ${index}, skipping`);
                return null;
            }
            
            const cleaned = {
                level: typeof entry.level === 'number' ? entry.level : 0,
                question: entry.question ? String(entry.question).trim() : '',
                answer: entry.answer ? String(entry.answer).trim() : '',
                timestamp: entry.timestamp ? String(entry.timestamp) : new Date().toISOString()
            };
            
            // Validate required fields
            if (!cleaned.question || !cleaned.answer) {
                console.warn(`[Clean] qaLog entry at index ${index} missing question or answer, skipping`);
                return null;
            }
            
            return cleaned;
        }).filter(entry => entry !== null);
    }

    // Validate save data structure
    validateSaveData(data) {
        try {
            // Check required fields
            if (!data) {
                console.error('[Validation] Data is null or undefined');
                return false;
            }
            
            if (!data.version || !data.savedAt) {
                console.error('[Validation] Missing version or savedAt:', { version: data.version, savedAt: data.savedAt });
                return false;
            }
            
            if (typeof data.currentWhyLevel !== 'number' || isNaN(data.currentWhyLevel)) {
                console.error('[Validation] Invalid currentWhyLevel:', data.currentWhyLevel);
                return false;
            }
            
            if (typeof data.maxWhyLevel !== 'number' || isNaN(data.maxWhyLevel)) {
                console.error('[Validation] Invalid maxWhyLevel:', data.maxWhyLevel);
                return false;
            }
            
            if (!Array.isArray(data.whyTree)) {
                console.error('[Validation] whyTree is not an array:', typeof data.whyTree);
                return false;
            }
            
            if (!Array.isArray(data.qaLog)) {
                console.error('[Validation] qaLog is not an array:', typeof data.qaLog);
                return false;
            }
            
            // Validate whyTree structure recursively
            const validateBranch = (branch, path = 'root') => {
                if (!branch || typeof branch !== 'object') {
                    console.error(`[Validation] Branch at ${path} is not an object:`, branch);
                    return false;
                }
                
                if (typeof branch.level !== 'number' || isNaN(branch.level)) {
                    console.error(`[Validation] Branch at ${path} has invalid level:`, branch.level);
                    return false;
                }
                
                // Branch must have either problem (for root) or answer (for children)
                if (!branch.problem && !branch.answer) {
                    console.error(`[Validation] Branch at ${path} has neither problem nor answer:`, branch);
                    return false;
                }
                
                // Validate children recursively if they exist
                if (branch.children !== undefined) {
                    if (!Array.isArray(branch.children)) {
                        console.error(`[Validation] Branch at ${path} has invalid children (not array):`, branch.children);
                        return false;
                    }
                    
                    // Recursively validate each child
                    for (let i = 0; i < branch.children.length; i++) {
                        if (!validateBranch(branch.children[i], `${path}.children[${i}]`)) {
                            return false;
                        }
                    }
                }
                
                return true;
            };
            
            // Validate all branches in whyTree
            for (let i = 0; i < data.whyTree.length; i++) {
                if (!validateBranch(data.whyTree[i], `whyTree[${i}]`)) {
                    return false;
                }
            }
            
            // Validate qaLog structure
            for (let i = 0; i < data.qaLog.length; i++) {
                const entry = data.qaLog[i];
                if (!entry || typeof entry !== 'object') {
                    console.error(`[Validation] qaLog[${i}] is not an object:`, entry);
                    return false;
                }
                
                if (typeof entry.level !== 'number' || isNaN(entry.level)) {
                    console.error(`[Validation] qaLog[${i}] has invalid level:`, entry.level);
                    return false;
                }
                
                if (!entry.question || typeof entry.question !== 'string' || entry.question.trim() === '') {
                    console.error(`[Validation] qaLog[${i}] has invalid question:`, entry.question);
                    return false;
                }
                
                if (!entry.answer || typeof entry.answer !== 'string' || entry.answer.trim() === '') {
                    console.error(`[Validation] qaLog[${i}] has invalid answer:`, entry.answer);
                    return false;
                }
                
                if (!entry.timestamp || typeof entry.timestamp !== 'string') {
                    console.error(`[Validation] qaLog[${i}] has invalid timestamp:`, entry.timestamp);
                    return false;
                }
            }
            
            console.log('[Validation] Data validation passed');
            return true;
        } catch (error) {
            console.error('[Validation] Validation error:', error);
            console.error('[Validation] Error stack:', error.stack);
            return false;
        }
    }

    // Handle file load
    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validate loaded data
                if (!this.validateSaveData(data)) {
                    alert('Error: Invalid file format or corrupted data. Cannot load.');
                    return;
                }

                // Load the analysis
                this.loadAnalysis(data);
            } catch (error) {
                console.error('Error loading file:', error);
                alert('Error: Failed to parse file. Please ensure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    // Load analysis from data
    loadAnalysis(data) {
        if (!confirm('Loading this analysis will replace your current work. Continue?')) {
            return;
        }

        try {
            // Restore state
            this.problemStatement = data.problemStatement || null;
            this.currentWhyLevel = data.currentWhyLevel || 0;
            this.maxWhyLevel = data.maxWhyLevel || 5;
            this.languageLevel = data.languageLevel || 3;
            this.whyTree = data.whyTree || [];
            this.qaLog = data.qaLog || [];

            // Restore model selection if available, but only if no model is currently selected
            // This ensures deep analysis uses the user's currently selected model, not the saved one
            if (data.selectedModel) {
                // Only restore if no model is currently selected
                if (!this.ollamaIntegration.selectedModel) {
                    this.ollamaIntegration.setModel(data.selectedModel);
                    this.ollamaModelSelect.value = data.selectedModel;
                    this.updateOllamaStatus();
                } else {
                    console.log(`[Load] Keeping currently selected model: ${this.ollamaIntegration.selectedModel} (saved model was: ${data.selectedModel})`);
                }
            }

            // Restore language level
            this.languageSlider.value = this.languageLevel;
            this.updateLanguageDisplay();
            this.updateUITexts();

            // Update UI
            this.updateQALog();

            // Hide examples and show answer section if analysis in progress
            if (this.currentWhyLevel > 0 && this.currentWhyLevel < this.maxWhyLevel) {
                this.examplesSection.classList.add('hidden');
                this.answerSection.classList.remove('hidden');
                this.startBtn.classList.add('hidden');
                this.resetBtn.classList.remove('hidden');
            }

            alert('Analysis loaded successfully!');
        } catch (error) {
            console.error('Error loading analysis:', error);
            alert('Error: Failed to load analysis data.');
        }
    }

    resetAnalysis() {
        const confirmText = this.languageAdjuster.adjustText('resetConfirm', this.languageLevel);
        if (confirm(confirmText)) {
            this.currentWhyLevel = 0;
            this.whyTree = [];
            this.qaLog = [];
            this.currentAnswer = '';
            this.selectedMCA = null;
            this.problemStatement = null;

            // Remove problem statement section if it exists
            const problemSection = document.getElementById('problem-statement-section');
            if (problemSection) {
                problemSection.remove();
            }

            this.startBtn.classList.remove('hidden');
            this.resetBtn.classList.add('hidden');
            this.answerSection.classList.add('hidden');
            this.mcaSection.classList.add('hidden');
            this.examplesSection.classList.remove('hidden');
            this.qaLogContainer.innerHTML = '';
            this.questionText.textContent = '';
            this.questionNumber.textContent = '';
            this.statusBar.classList.add('hidden');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FiveWhysApp();
});

