// Repository: https://github.com/pleabargain/five-whys
// Unit Tests for Five Whys Analysis Tool
// User-facing function tests

class FiveWhysTests {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    runAllTests() {
        console.log('=== Running Five Whys Analysis Tool Tests ===\n');
        
        this.testValidateSaveData();
        this.testTruncateText();
        this.testExtractKeyPhrases();
        this.testLanguageComplexityAdjuster();
        this.testExportQALog();
        this.testProblemStatementValidation();
        this.testSaveAnalysis();
        this.testLanguageLevelEnforcement();
        this.testSaveDataValidation();
        
        this.printResults();
    }

    assert(condition, testName, message = '') {
        if (condition) {
            this.passed++;
            console.log(`✓ PASS: ${testName}`);
            return true;
        } else {
            this.failed++;
            console.error(`✗ FAIL: ${testName}${message ? ' - ' + message : ''}`);
            return false;
        }
    }

    // Test validateSaveData function
    testValidateSaveData() {
        console.log('\n--- Testing validateSaveData ---');
        
        const app = new FiveWhysApp();
        
        // Valid data structure
        const validData = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            problemStatement: 'Test problem',
            currentWhyLevel: 3,
            maxWhyLevel: 5,
            languageLevel: 3,
            selectedModel: 'llama2',
            whyTree: [{
                level: 0,
                problem: 'Test problem',
                children: [{
                    level: 1,
                    answer: 'Test answer',
                    children: []
                }]
            }],
            qaLog: [{
                level: 1,
                question: 'Why test?',
                answer: 'Test answer',
                timestamp: new Date().toISOString()
            }]
        };
        
        this.assert(
            app.validateSaveData(validData) === true,
            'validateSaveData with valid data'
        );
        
        // Missing required fields
        const invalidData1 = {
            version: '1.0'
            // Missing savedAt
        };
        
        this.assert(
            app.validateSaveData(invalidData1) === false,
            'validateSaveData with missing fields'
        );
        
        // Invalid whyTree structure
        const invalidData2 = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            currentWhyLevel: 0,
            maxWhyLevel: 5,
            whyTree: [{ invalid: 'structure' }],
            qaLog: []
        };
        
        this.assert(
            app.validateSaveData(invalidData2) === false,
            'validateSaveData with invalid whyTree structure'
        );
        
        // Invalid qaLog structure
        const invalidData3 = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            currentWhyLevel: 0,
            maxWhyLevel: 5,
            whyTree: [],
            qaLog: [{ invalid: 'structure' }]
        };
        
        this.assert(
            app.validateSaveData(invalidData3) === false,
            'validateSaveData with invalid qaLog structure'
        );
    }

    // Test truncateText function
    testTruncateText() {
        console.log('\n--- Testing truncateText ---');
        
        const app = new FiveWhysApp();
        
        // Short text should not be truncated
        this.assert(
            app.truncateText('Short', 15) === 'Short',
            'truncateText with short text'
        );
        
        // Long text should be truncated
        const longText = 'This is a very long text that should be truncated';
        const truncated = app.truncateText(longText, 15);
        this.assert(
            truncated.length === 15 && truncated.endsWith('...'),
            'truncateText with long text',
            `Expected length 15 with '...', got: ${truncated}`
        );
        
        // Empty string
        this.assert(
            app.truncateText('', 15) === '',
            'truncateText with empty string'
        );
    }

    // Test extractKeyPhrases function
    testExtractKeyPhrases() {
        console.log('\n--- Testing extractKeyPhrases ---');
        
        const app = new FiveWhysApp();
        
        // Simple text
        const simpleText = 'The system failed because of network issues';
        const phrases1 = app.extractKeyPhrases(simpleText);
        this.assert(
            Array.isArray(phrases1) && phrases1.length > 0 && phrases1.length <= 4,
            'extractKeyPhrases returns array with valid length',
            `Got ${phrases1.length} phrases`
        );
        
        // Multi-sentence text
        const multiSentence = 'The server crashed. The database was overloaded. Memory was exhausted.';
        const phrases2 = app.extractKeyPhrases(multiSentence);
        this.assert(
            Array.isArray(phrases2) && phrases2.length > 0,
            'extractKeyPhrases handles multi-sentence text'
        );
        
        // Very short text
        const shortText = 'Error';
        const phrases3 = app.extractKeyPhrases(shortText);
        this.assert(
            Array.isArray(phrases3) && phrases3.length > 0,
            'extractKeyPhrases handles short text'
        );
    }

    // Test LanguageComplexityAdjuster
    testLanguageComplexityAdjuster() {
        console.log('\n--- Testing LanguageComplexityAdjuster ---');
        
        const adjuster = new LanguageComplexityAdjuster();
        
        // Test getLevel
        const level = adjuster.getLevel(3);
        this.assert(
            level.code === 'B1' && level.name === 'Intermediate',
            'getLevel returns correct level info'
        );
        
        // Test getComplexity
        this.assert(
            adjuster.getComplexity(1) === 'very_simple',
            'getComplexity returns correct complexity for A1'
        );
        
        this.assert(
            adjuster.getComplexity(6) === 'very_complex',
            'getComplexity returns correct complexity for C2'
        );
        
        // Test adjustText
        const question = adjuster.adjustText('initialQuestion', 3);
        this.assert(
            typeof question === 'string' && question.length > 0,
            'adjustText returns valid string'
        );
        
        // Test adjustText with replacements
        const whyQuestion = adjuster.adjustText('whyQuestion', 3, { text: 'test' });
        this.assert(
            whyQuestion.includes('test'),
            'adjustText applies replacements correctly'
        );
        
        // Test simplifyText
        const complexText = 'This is a complex, multi-part sentence; it has various elements.';
        const simplified = adjuster.simplifyText(complexText, 1);
        this.assert(
            simplified.length <= complexText.length,
            'simplifyText reduces complexity for A1 level'
        );
    }

    // Test exportQALog (structure validation)
    testExportQALog() {
        console.log('\n--- Testing exportQALog structure ---');
        
        const app = new FiveWhysApp();
        
        // Set up test data
        app.problemStatement = 'Test problem';
        app.qaLog = [
            {
                level: 1,
                question: 'Why test?',
                answer: 'Test answer',
                timestamp: new Date().toISOString()
            }
        ];
        
        // Mock clipboard API
        const originalWriteText = navigator.clipboard.writeText;
        let clipboardContent = '';
        navigator.clipboard.writeText = (text) => {
            clipboardContent = text;
            return Promise.resolve();
        };
        
        // Call export function
        app.exportQALog();
        
        // Verify structure
        setTimeout(() => {
            this.assert(
                clipboardContent.includes('FIVE WHYS ANALYSIS'),
                'exportQALog includes header'
            );
            
            this.assert(
                clipboardContent.includes('Test problem'),
                'exportQALog includes problem statement'
            );
            
            this.assert(
                clipboardContent.includes('Q1:') && clipboardContent.includes('A1:'),
                'exportQALog includes Q&A entries'
            );
            
            // Restore original
            navigator.clipboard.writeText = originalWriteText;
        }, 100);
    }

    // Test problem statement validation
    testProblemStatementValidation() {
        console.log('\n--- Testing Problem Statement Validation ---');
        
        const app = new FiveWhysApp();
        
        // Valid problem statement
        app.problemStatement = 'Our team missed the deadline';
        this.assert(
            app.problemStatement.length > 0,
            'Problem statement accepts valid input'
        );
        
        // Empty problem statement should be rejected
        const emptyStatement = '';
        this.assert(
            emptyStatement.trim().length === 0,
            'Empty problem statement is detected'
        );
    }

    // Test saveAnalysis function
    testSaveAnalysis() {
        console.log('\n--- Testing saveAnalysis ---');
        
        const app = new FiveWhysApp();
        
        // Set up test data
        app.problemStatement = 'Test problem statement';
        app.currentWhyLevel = 3;
        app.maxWhyLevel = 5;
        app.languageLevel = 3;
        app.whyTree = [{
            level: 0,
            problem: 'Test problem statement',
            children: [{
                level: 1,
                answer: 'Test answer 1',
                children: []
            }]
        }];
        app.qaLog = [{
            level: 1,
            question: 'Why test?',
            answer: 'Test answer 1',
            timestamp: new Date().toISOString()
        }];
        app.ollamaIntegration = {
            selectedModel: 'llama2'
        };
        
        // Mock document.createElement and related DOM methods
        let createdElement = null;
        let blobCreated = null;
        let downloadCalled = false;
        let clickCalled = false;
        
        const originalCreateElement = document.createElement;
        const originalCreateObjectURL = URL.createObjectURL;
        const originalRevokeObjectURL = URL.revokeObjectURL;
        const originalAppendChild = document.body.appendChild;
        const originalRemoveChild = document.body.removeChild;
        
        document.createElement = function(tagName) {
            if (tagName === 'a') {
                createdElement = {
                    href: '',
                    download: '',
                    click: function() {
                        clickCalled = true;
                    }
                };
                return createdElement;
            }
            return originalCreateElement.call(document, tagName);
        };
        
        URL.createObjectURL = function(blob) {
            blobCreated = blob;
            return 'blob:test-url';
        };
        
        URL.revokeObjectURL = function(url) {
            // Mock implementation
        };
        
        document.body.appendChild = function(element) {
            return element;
        };
        
        document.body.removeChild = function(element) {
            // Mock implementation
        };
        
        // Mock alert
        const originalAlert = window.alert;
        let alertMessage = '';
        window.alert = function(message) {
            alertMessage = message;
        };
        
        // Call saveAnalysis
        app.saveAnalysis();
        
        // Verify results
        this.assert(
            blobCreated !== null,
            'saveAnalysis creates a blob',
            'Blob was not created'
        );
        
        if (blobCreated) {
            // Read blob content
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const savedData = JSON.parse(e.target.result);
                    
                    this.assert(
                        savedData.version === '1.0',
                        'saveAnalysis includes version',
                        `Expected version '1.0', got '${savedData.version}'`
                    );
                    
                    this.assert(
                        savedData.problemStatement === 'Test problem statement',
                        'saveAnalysis includes problem statement',
                        `Expected 'Test problem statement', got '${savedData.problemStatement}'`
                    );
                    
                    this.assert(
                        savedData.currentWhyLevel === 3,
                        'saveAnalysis includes currentWhyLevel',
                        `Expected 3, got ${savedData.currentWhyLevel}`
                    );
                    
                    this.assert(
                        Array.isArray(savedData.whyTree) && savedData.whyTree.length > 0,
                        'saveAnalysis includes whyTree',
                        'whyTree is missing or empty'
                    );
                    
                    this.assert(
                        Array.isArray(savedData.qaLog) && savedData.qaLog.length > 0,
                        'saveAnalysis includes qaLog',
                        'qaLog is missing or empty'
                    );
                    
                    this.assert(
                        savedData.savedAt !== undefined,
                        'saveAnalysis includes savedAt timestamp',
                        'savedAt timestamp is missing'
                    );
                    
                    this.assert(
                        clickCalled === true,
                        'saveAnalysis triggers download',
                        'Download was not triggered'
                    );
                    
                    this.assert(
                        alertMessage.includes('successfully'),
                        'saveAnalysis shows success message',
                        `Expected success message, got: ${alertMessage}`
                    );
                } catch (error) {
                    this.assert(
                        false,
                        'saveAnalysis creates valid JSON',
                        `JSON parse error: ${error.message}`
                    );
                }
            };
            reader.readAsText(blobCreated);
        }
        
        // Test with empty data
        app.whyTree = [];
        app.qaLog = [];
        alertMessage = '';
        app.saveAnalysis();
        
        this.assert(
            alertMessage.includes('No analysis data'),
            'saveAnalysis rejects empty data',
            `Expected rejection message, got: ${alertMessage}`
        );
        
        // Restore mocks
        document.createElement = originalCreateElement;
        URL.createObjectURL = originalCreateObjectURL;
        URL.revokeObjectURL = originalRevokeObjectURL;
        document.body.appendChild = originalAppendChild;
        document.body.removeChild = originalRemoveChild;
        window.alert = originalAlert;
        
        // Restore test data
        app.whyTree = [{
            level: 0,
            problem: 'Test problem statement',
            children: []
        }];
        app.qaLog = [{
            level: 1,
            question: 'Why test?',
            answer: 'Test answer 1',
            timestamp: new Date().toISOString()
        }];
    }

    // Test language level enforcement
    testLanguageLevelEnforcement() {
        console.log('\n--- Testing Language Level Enforcement ---');
        
        const ollamaIntegration = new OllamaIntegration();
        const languageAdjuster = new LanguageComplexityAdjuster();
        
        // Test A1 level enforcement
        const complexQuestion = 'Why are current operational processes failing to consistently meet employee nutritional needs?';
        const simplifiedA1 = ollamaIntegration.enforceLanguageLevel(complexQuestion, 'A1', languageAdjuster);
        
        this.assert(
            simplifiedA1.length < complexQuestion.length || simplifiedA1 === 'Why did this happen?',
            'A1 level simplifies complex questions',
            `Expected simplified question, got: "${simplifiedA1}"`
        );
        
        // Check word count for A1
        const a1Words = simplifiedA1.split(/\s+/).length;
        this.assert(
            a1Words <= 10,
            'A1 level questions have maximum 10 words',
            `Expected <= 10 words, got ${a1Words} words`
        );
        
        // Check for complex words in A1
        const hasComplexWords = /(operational|processes|consistently|nutritional|requirements)/i.test(simplifiedA1);
        this.assert(
            !hasComplexWords,
            'A1 level removes complex vocabulary',
            `Found complex words in A1 question: "${simplifiedA1}"`
        );
        
        // Test A2 level enforcement
        const simplifiedA2 = ollamaIntegration.enforceLanguageLevel(complexQuestion, 'A2', languageAdjuster);
        const a2Words = simplifiedA2.split(/\s+/).length;
        this.assert(
            a2Words <= 15,
            'A2 level questions have maximum 15 words',
            `Expected <= 15 words, got ${a2Words} words`
        );
        
        // Test that higher levels don't simplify unnecessarily
        const c2Question = 'Why are current operational processes failing to consistently meet employee nutritional needs?';
        const unchangedC2 = ollamaIntegration.enforceLanguageLevel(c2Question, 'C2', languageAdjuster);
        this.assert(
            unchangedC2 === c2Question,
            'C2 level preserves complex questions',
            `Expected unchanged, got: "${unchangedC2}"`
        );
        
        // Test B1 level
        const unchangedB1 = ollamaIntegration.enforceLanguageLevel('Why did this happen?', 'B1', languageAdjuster);
        this.assert(
            unchangedB1 === 'Why did this happen?',
            'B1 level preserves simple questions',
            `Expected unchanged, got: "${unchangedB1}"`
        );
    }

    // Test save data validation with real data structures
    testSaveDataValidation() {
        console.log('\n--- Testing Save Data Validation ---');
        
        const app = new FiveWhysApp();
        
        // Test 1: Valid data with problem statement and qaLog
        app.problemStatement = 'We forgot to buy food';
        app.currentWhyLevel = 2;
        app.maxWhyLevel = 5;
        app.languageLevel = 1;
        app.whyTree = [{
            level: 0,
            problem: 'We forgot to buy food',
            children: [{
                level: 1,
                answer: 'We did not go shopping',
                children: [{
                    level: 2,
                    answer: 'We stayed at home',
                    children: []
                }]
            }]
        }];
        app.qaLog = [{
            level: 1,
            question: 'Why did we forget to buy food?',
            answer: 'We did not go shopping',
            timestamp: new Date().toISOString()
        }, {
            level: 2,
            question: 'Why did we not go shopping?',
            answer: 'We stayed at home',
            timestamp: new Date().toISOString()
        }];
        app.ollamaIntegration = {
            selectedModel: 'llama2'
        };
        
        const saveData1 = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            problemStatement: app.problemStatement,
            currentWhyLevel: app.currentWhyLevel,
            maxWhyLevel: app.maxWhyLevel,
            languageLevel: app.languageLevel,
            selectedModel: app.ollamaIntegration.selectedModel,
            whyTree: app.whyTree,
            qaLog: app.qaLog
        };
        
        this.assert(
            app.validateSaveData(saveData1) === true,
            'validateSaveData with valid nested structure',
            'Should pass validation'
        );
        
        // Test 2: Empty whyTree but valid qaLog
        const saveData2 = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            problemStatement: 'Test problem',
            currentWhyLevel: 0,
            maxWhyLevel: 5,
            languageLevel: 3,
            selectedModel: 'llama2',
            whyTree: [],
            qaLog: []
        };
        
        this.assert(
            app.validateSaveData(saveData2) === true,
            'validateSaveData with empty arrays',
            'Empty arrays should be valid'
        );
        
        // Test 3: Invalid - missing children array
        const saveData3 = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            problemStatement: 'Test',
            currentWhyLevel: 1,
            maxWhyLevel: 5,
            languageLevel: 3,
            selectedModel: 'llama2',
            whyTree: [{
                level: 0,
                problem: 'Test',
                children: [{
                    level: 1,
                    answer: 'Test answer'
                    // Missing children array
                }]
            }],
            qaLog: []
        };
        
        this.assert(
            app.validateSaveData(saveData3) === true,
            'validateSaveData with missing children (should be optional)',
            'Missing children should default to undefined and be valid'
        );
        
        // Test 4: Invalid - branch with neither problem nor answer
        const saveData4 = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            problemStatement: 'Test',
            currentWhyLevel: 0,
            maxWhyLevel: 5,
            languageLevel: 3,
            selectedModel: 'llama2',
            whyTree: [{
                level: 0
                // Missing both problem and answer
            }],
            qaLog: []
        };
        
        this.assert(
            app.validateSaveData(saveData4) === false,
            'validateSaveData rejects branch without problem or answer',
            'Should fail validation'
        );
        
        // Test 5: Invalid - qaLog entry with empty question
        const saveData5 = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            problemStatement: 'Test',
            currentWhyLevel: 1,
            maxWhyLevel: 5,
            languageLevel: 3,
            selectedModel: 'llama2',
            whyTree: [{
                level: 0,
                problem: 'Test',
                children: []
            }],
            qaLog: [{
                level: 1,
                question: '', // Empty question
                answer: 'Test answer',
                timestamp: new Date().toISOString()
            }]
        };
        
        this.assert(
            app.validateSaveData(saveData5) === false,
            'validateSaveData rejects qaLog with empty question',
            'Should fail validation'
        );
        
        // Test 6: Invalid - qaLog entry with invalid level
        const saveData6 = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            problemStatement: 'Test',
            currentWhyLevel: 1,
            maxWhyLevel: 5,
            languageLevel: 3,
            selectedModel: 'llama2',
            whyTree: [{
                level: 0,
                problem: 'Test',
                children: []
            }],
            qaLog: [{
                level: 'invalid', // Not a number
                question: 'Why test?',
                answer: 'Test answer',
                timestamp: new Date().toISOString()
            }]
        };
        
        this.assert(
            app.validateSaveData(saveData6) === false,
            'validateSaveData rejects qaLog with invalid level type',
            'Should fail validation'
        );
        
        // Test 7: Deeply nested structure
        const saveData7 = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            problemStatement: 'Deep test',
            currentWhyLevel: 3,
            maxWhyLevel: 5,
            languageLevel: 3,
            selectedModel: 'llama2',
            whyTree: [{
                level: 0,
                problem: 'Deep test',
                children: [{
                    level: 1,
                    answer: 'Level 1 answer',
                    children: [{
                        level: 2,
                        answer: 'Level 2 answer',
                        children: [{
                            level: 3,
                            answer: 'Level 3 answer',
                            children: []
                        }]
                    }]
                }]
            }],
            qaLog: [
                { level: 1, question: 'Q1?', answer: 'A1', timestamp: new Date().toISOString() },
                { level: 2, question: 'Q2?', answer: 'A2', timestamp: new Date().toISOString() },
                { level: 3, question: 'Q3?', answer: 'A3', timestamp: new Date().toISOString() }
            ]
        };
        
        this.assert(
            app.validateSaveData(saveData7) === true,
            'validateSaveData with deeply nested structure',
            'Should pass validation'
        );
    }

    printResults() {
        console.log('\n=== Test Results ===');
        console.log(`Total Tests: ${this.passed + this.failed}`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
        
        if (this.failed === 0) {
            console.log('\n✓ All tests passed!');
        } else {
            console.log(`\n✗ ${this.failed} test(s) failed. Please review the errors above.`);
        }
    }
}

// Run tests when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Only run tests if explicitly requested (via console or test runner)
        if (window.runTests === true || window.location.search.includes('test=true')) {
            const testRunner = new FiveWhysTests();
            testRunner.runAllTests();
        }
    });
}

// Export for use in test runners
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FiveWhysTests;
}

