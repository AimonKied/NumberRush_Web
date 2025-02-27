// Level Manager module - handles level logic and progression
const levelManager = {
  loadLevel: function(level) {
    gameState.level = level;
    
    // Initialize the grid first to get the available numbers
    gridManager.createGrid();
    
    // Calculate max operands based on level
    gameState.maxOperands = this.calculateMaxOperands(level);
    
    // Now calculate a target sum based on the available numbers in the grid
    gameState.targetSum = this.calculateTargetSum(level);
    
    gameState.resetSelection();
    
    // Update UI to show max operands
    uiManager.updateLevelInfo();
  },

  calculateTargetSum: function(level) {
    // Find available numbers in the grid
    const allNumbers = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        allNumbers.push(gameState.grid[row][col]);
      }
    }
    
    // Create a valid target sum based on the level difficulty
    const difficultyFactor = Math.min(1 + (level * 0.1), 3); // Ranges from 1.1 to 3.0
    const maxOperands = this.calculateMaxOperands(level);
    
    // Find clusters of adjacent numbers in the grid
    const numberClusters = this.findNumberClusters(gameState.grid, maxOperands);
    
    // If no valid clusters found, generate a simpler target
    if (numberClusters.length === 0) {
      return level * 10; // Fallback to simple calculation
    }
    
    // Select a random cluster based on difficulty
    // Higher difficulty prefers clusters with more diverse operations
    const selectedClusters = numberClusters.filter(cluster => 
      cluster.complexity >= Math.min(level * 0.2, 1.0)
    );
    
    const cluster = selectedClusters.length > 0 
      ? selectedClusters[Math.floor(Math.random() * selectedClusters.length)]
      : numberClusters[Math.floor(Math.random() * numberClusters.length)];
    
    return Math.round(cluster.result);
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
  },
  
  // Find clusters of adjacent numbers in the grid
  findNumberClusters: function(grid, maxOperands) {
    const clusters = [];
    const operations = ['+', '-', '*', '/'];
    
    // Helper function to check if cells are adjacent
    const isAdjacent = (cell1, cell2) => {
      return Math.abs(cell1.row - cell2.row) + Math.abs(cell1.col - cell2.col) === 1;
    };
    
    // Helper function to check if a cell is in a path
    const isInPath = (path, row, col) => {
      return path.some(cell => cell.row === row && cell.col === col);
    };
    
    // Function to calculate the result given a path and operations
    const calculateResult = (path, ops) => {
      let result = grid[path[0].row][path[0].col];
      for (let i = 1; i < path.length; i++) {
        const num = grid[path[i].row][path[i].col];
        switch (ops[i-1]) {
          case '+': result += num; break;
          case '-': result -= num; break;
          case '*': result *= num; break;
          case '/': 
            // Avoid division by zero or results with remainders
            if (num === 0 || result % num !== 0) return null;
            result /= num; 
            break;
        }
      }
      return result;
    };
    
    // Calculate complexity of operations (more diverse operations = higher complexity)
    const calculateComplexity = (ops) => {
      const uniqueOps = new Set(ops);
      return uniqueOps.size / operations.length;
    };
    
    // Start DFS from each cell
    for (let startRow = 0; startRow < 8; startRow++) {
      for (let startCol = 0; startCol < 8; startCol++) {
        // DFS to find paths of adjacent cells
        const dfs = (path, level) => {
          if (path.length === maxOperands) {
            // Generate all possible operation combinations
            const generateOpCombinations = (length, current = []) => {
              if (current.length === length) {
                const result = calculateResult(path, current);
                if (result !== null && result > 0 && result <= 100 && Number.isInteger(result)) {
                  clusters.push({
                    path: [...path],
                    operations: [...current],
                    result: result,
                    complexity: calculateComplexity(current)
                  });
                }
                return;
              }
              
              for (const op of operations) {
                generateOpCombinations(length, [...current, op]);
              }
            };
            
            generateOpCombinations(maxOperands - 1);
            return;
          }
          
          // Try all adjacent cells
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              // Skip diagonals and center
              if (Math.abs(dr) + Math.abs(dc) !== 1) continue;
              
              const newRow = path[path.length - 1].row + dr;
              const newCol = path[path.length - 1].col + dc;
              
              // Check if cell is valid and not already in path
              if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && 
                  !isInPath(path, newRow, newCol)) {
                dfs([...path, {row: newRow, col: newCol}], level + 1);
              }
            }
          }
        };
        
        dfs([{row: startRow, col: startCol}], 1);
      }
    }
    
    return clusters;
  }
};