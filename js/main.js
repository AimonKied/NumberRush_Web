// Main entry point for the game
function initGame() {
  // Initialize game state
  gameState.init();
  
  // Initialize UI based on current view
  uiManager.initUI();
}

// Start the game when the page is loaded
document.addEventListener('DOMContentLoaded', initGame);