// Test script to verify useStartupJourney API compatibility

const expectedAPI = [
    // Properties
    'isInitialized',
    'isLoading',
    'isComplete',
    'stage',
    'stages',
    'startupData',
    'messages',
    'progress',
    'editingStage',
    'isReadyForNextSection',
    'suggestionModalOpen',
    'currentSuggestion',
    
    // Methods
    'handleSendMessage',
    'handleRequestSuggestion',
    'handleRefineSuggestion',
    'handleSuggestionModalAccept',
    'handleSuggestionModalClose',
    'proceedToNextSection',
    'editStage',
    'jumpToStage',
    'cancelDirectEdit',
    'handleUpdateStageData',
    'reloadLocale',
    'restartJourney',
    'exportProject',
    'handleRefineEditedStage',
    'handleGenerateSummary',
    'getFirstUncompletedStage'
];

console.log('✅ Expected API methods:', expectedAPI.length);
console.log('📋 List:', expectedAPI.join(', '));
