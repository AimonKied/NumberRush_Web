// Level Manager module - handles level logic and progression
const levelManager = {
  loadLevel: function(level) {
    gameState.level = level;
    gameState.targetSum = this.calculateTargetSum(level);
    
    // Calculate max operands based on level
    gameState.maxOperands = this.calculateMaxOperands(level);
    
    gameState.resetSelection();
    
    // Update UI to show max operands
    uiManager.updateLevelInfo();
  },

  calculateTargetSum: function(level) {
    // Example target sum calculation based on level
    return level * 10;
  },
  
  calculateMaxOperands: function(level) {
    // Determine maximum number of operands based on level
    // Levels 1-5: 2 operands
    // Levels 6-10: 3 operands
    // Levels 11-15: 4 operands
    // Levels 16+: 5 operands
    if (level <= 5) {
      return 2;
    } else if (level <= 10) {
      return 3;
    } else if (level <= 15) {
      return 4;
    } else {
      return 5;
    }
  }
};