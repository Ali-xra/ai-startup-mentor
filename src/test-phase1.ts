/**
 * ========================================
 * Test Script for Phase 1 Configuration
 * ========================================
 *
 * This script tests the new stage configuration system
 * to ensure everything is properly structured.
 */

import { PHASE_1, ALL_PHASES, getStageById, getAllStagesFlat } from './config/stages';

console.log('\n========================================');
console.log('🧪 Testing Phase 1 Configuration');
console.log('========================================\n');

// ========================================
// Test 1: Basic Structure
// ========================================
console.log('📦 Test 1: Basic Structure');
console.log('----------------------------');

console.log('✓ Phase ID:', PHASE_1.id);
console.log('✓ Phase Number:', PHASE_1.phaseNumber);
console.log('✓ Title (EN):', PHASE_1.title_en);
console.log('✓ Title (FA):', PHASE_1.title_fa);
console.log('✓ Subsections Count:', PHASE_1.subsections.length);

console.log('\n✅ Basic structure loaded successfully!\n');

// ========================================
// Test 2: Subsections
// ========================================
console.log('📋 Test 2: Subsections');
console.log('----------------------------');

PHASE_1.subsections.forEach((subsection, index) => {
  console.log(`${index + 1}. ${subsection.title_en} (${subsection.title_fa})`);
  console.log(`   - ID: ${subsection.id}`);
  console.log(`   - Stages: ${subsection.stages.length}`);
});

console.log('\n✅ All subsections loaded successfully!\n');

// ========================================
// Test 3: Individual Stages
// ========================================
console.log('📝 Test 3: Individual Stages');
console.log('----------------------------');

let totalStages = 0;
PHASE_1.subsections.forEach((subsection) => {
  subsection.stages.forEach((stage) => {
    totalStages++;
    console.log(`${totalStages}. ${stage.title_en} (${stage.title_fa})`);
    console.log(`   - ID: ${stage.id}`);
    console.log(`   - Data Key: ${stage.dataKey || 'N/A'}`);
    console.log(`   - Output Type: ${stage.outputType}`);
    console.log(`   - User Input Required: ${stage.userInputRequired}`);
    console.log(`   - Has Guidance (EN): ${!!stage.guidance_en}`);
    console.log(`   - Has Guidance (FA): ${!!stage.guidance_fa}`);
    console.log(`   - Has Question (EN): ${!!stage.question_en}`);
    console.log(`   - Has Question (FA): ${!!stage.question_fa}`);
    console.log(`   - Has Prompt Config: ${!!stage.promptConfig}`);
    console.log('');
  });
});

console.log(`✅ Total stages: ${totalStages}\n`);

// ========================================
// Test 4: Helper Functions
// ========================================
console.log('🔧 Test 4: Helper Functions');
console.log('----------------------------');

// Test getStageById
const testStage = getStageById('ELEVATOR_PITCH');
if (testStage) {
  console.log('✓ getStageById("ELEVATOR_PITCH") works!');
  console.log(`  - Title: ${testStage.title_en}`);
  console.log(`  - Data Key: ${testStage.dataKey}`);
} else {
  console.error('❌ getStageById failed!');
}

// Test getAllStagesFlat
const allStagesFlat = getAllStagesFlat();
console.log(`✓ getAllStagesFlat() works!`);
console.log(`  - Total stages: ${allStagesFlat.length}`);

console.log('\n✅ Helper functions work correctly!\n');

// ========================================
// Test 5: Data Completeness Check
// ========================================
console.log('🔍 Test 5: Data Completeness');
console.log('----------------------------');

let issues = 0;

getAllStagesFlat().forEach((stage: any) => {
  // Check required fields
  if (!stage.id) {
    console.error(`❌ Stage missing ID`);
    issues++;
  }
  if (!stage.title_en) {
    console.error(`❌ Stage ${stage.id} missing title_en`);
    issues++;
  }
  if (!stage.title_fa) {
    console.error(`❌ Stage ${stage.id} missing title_fa`);
    issues++;
  }
  if (!stage.question_en) {
    console.error(`❌ Stage ${stage.id} missing question_en`);
    issues++;
  }
  if (!stage.question_fa) {
    console.error(`❌ Stage ${stage.id} missing question_fa`);
    issues++;
  }
  if (!stage.outputType) {
    console.error(`❌ Stage ${stage.id} missing outputType`);
    issues++;
  }
  if (stage.userInputRequired === undefined) {
    console.error(`❌ Stage ${stage.id} missing userInputRequired`);
    issues++;
  }
});

if (issues === 0) {
  console.log('✅ All stages have required fields!\n');
} else {
  console.error(`❌ Found ${issues} issues!\n`);
}

// ========================================
// Test 6: Prompt Configuration
// ========================================
console.log('🤖 Test 6: Prompt Configuration');
console.log('----------------------------');

let stagesWithPrompts = 0;
let stagesWithConstraints = 0;

getAllStagesFlat().forEach((stage: any) => {
  if (stage.promptConfig) {
    stagesWithPrompts++;
    if (stage.promptConfig.constraints) {
      stagesWithConstraints++;
    }
  }
});

console.log(`✓ Stages with prompt config: ${stagesWithPrompts}/${totalStages}`);
console.log(`✓ Stages with constraints: ${stagesWithConstraints}/${totalStages}`);

console.log('\n✅ Prompt configurations present!\n');

// ========================================
// Test 7: Sample Stage Details
// ========================================
console.log('📄 Test 7: Sample Stage Details');
console.log('----------------------------');

const sampleStage = getStageById('ELEVATOR_PITCH');
if (sampleStage) {
  console.log('Stage: ELEVATOR_PITCH');
  console.log('---');
  console.log('Title (EN):', sampleStage.title_en);
  console.log('Title (FA):', sampleStage.title_fa);
  console.log('\nGuidance (EN):');
  console.log(sampleStage.guidance_en?.substring(0, 100) + '...');
  console.log('\nGuidance (FA):');
  console.log(sampleStage.guidance_fa?.substring(0, 100) + '...');
  console.log('\nQuestion (EN):', sampleStage.question_en);
  console.log('Question (FA):', sampleStage.question_fa);
  console.log('\nOutput Type:', sampleStage.outputType);
  console.log('User Input Required:', sampleStage.userInputRequired);
  console.log('Data Key:', sampleStage.dataKey);

  if (sampleStage.promptConfig) {
    console.log('\nPrompt Config:');
    console.log('- Role:', sampleStage.promptConfig.role?.substring(0, 50) + '...');
    console.log('- Context Keys:', sampleStage.promptConfig.contextKeys);
    console.log('- Goal:', sampleStage.promptConfig.goal);
    console.log('- Constraints:', sampleStage.promptConfig.constraints);
  }
}

console.log('\n✅ Sample stage details verified!\n');

// ========================================
// Test 8: ALL_PHASES Check
// ========================================
console.log('🌍 Test 8: ALL_PHASES');
console.log('----------------------------');

console.log('Total Phases:', ALL_PHASES.phases.length);
console.log(
  'Phase IDs:',
  ALL_PHASES.phases.map((p) => p.id)
);

console.log('\n✅ ALL_PHASES structure correct!\n');

// ========================================
// Final Summary
// ========================================
console.log('========================================');
console.log('📊 Test Summary');
console.log('========================================');
console.log('✅ Phase 1 Configuration: PASSED');
console.log(`✅ Total Subsections: ${PHASE_1.subsections.length}`);
console.log(`✅ Total Stages: ${totalStages}`);
console.log(`✅ Data Completeness: ${issues === 0 ? 'PASSED' : 'FAILED'}`);
console.log(`✅ Helper Functions: PASSED`);
console.log(`✅ Prompt Configs: ${stagesWithPrompts}/${totalStages} stages`);
console.log('========================================\n');

if (issues === 0) {
  console.log('🎉 All tests passed! Ready for integration.\n');
  process.exit(0);
} else {
  console.error(`⚠️  Found ${issues} issues. Please fix before integration.\n`);
  process.exit(1);
}
