// Main entry point for the game
function initGame() {
    // Initialize UI components
    uiManager.initUI();
    
    // Create the grid
    gridManager.createGrid();
    
    // Load the first level
    levelManager.loadLevel(gameState.level);
  }
  
  // Start the game when the page is loaded
  document.addEventListener('DOMContentLoaded', initGame);