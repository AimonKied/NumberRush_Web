// Level Manager module - handles level logic and progression
const levelManager = {
    // Load level data for a specific level number
    loadLevel: function(levelNumber) {
      // In a real game, this would load level data from a predefined set
      // For this example, we'll generate a random target sum based on the level
      
      // Reset the grid with new random numbers
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          gameState.grid[row][col] = Math.floor(Math.random() * 10);
        }
      }
      
      // Set a target sum based on level (more difficult as levels increase)
      gameState.targetSum = 10 + levelNumber * 5;
      
      // Update game state and UI
      gameState.level = levelNumber;
      uiManager.updateLevelInfo();
      
      // Reset selection and update grid
      gameState.resetSelection();
      gridManager.updateGridDisplay();
      
      uiManager.showMessage(`Level ${levelNumber} loaded`);
    },
  
    // Go to the next level
    nextLevel: function() {
      this.loadLevel(gameState.level + 1);
    }
  };