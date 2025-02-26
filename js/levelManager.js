// Level Manager module - handles level logic and progression
const levelManager = {
  loadLevel: function(level) {
    gameState.level = level;
    gameState.targetSum = this.calculateTargetSum(level);
    gameState.resetSelection();
  },

  calculateTargetSum: function(level) {
    // Example target sum calculation based on level
    return level * 10;
  }
};