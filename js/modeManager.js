// Mode Manager module - handles switching between edit and calculate modes
const modeManager = {
    // Set the current game mode
    setMode: function(mode) {
      gameState.mode = mode;
      gameState.resetSelection();
      
      // Update UI to reflect current mode
      uiManager.updateModeButtons(mode);
      uiManager.showMessage(`Switched to ${mode} mode`);
    }
  };