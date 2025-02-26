// Game state module - manages the core game state
const gameState = {
    grid: [],           // 8x8 grid with numbers 0-9
    mode: 'edit',       // 'edit' or 'calculate'
    targetSum: 0,       // Target sum for the level
    level: 1,           // Current level
    selectedCells: [],  // Currently selected cells for calculation
    runningSum: 0,      // Current sum of selected cells
    
    // Reset selections and current sum
    resetSelection: function() {
      this.selectedCells = [];
      this.runningSum = 0;
      uiManager.updateRunningSum();
      
      // Update visual appearance
      const cells = document.querySelectorAll('.grid-cell');
      cells.forEach(cell => {
        cell.classList.remove('selected');
      });
      
      uiManager.showMessage('Selection reset');
    },
    
    // Add a cell to selection
    selectCell: function(row, col) {
      this.selectedCells.push({row, col});
      
      // Update visual appearance
      const cells = document.querySelectorAll('.grid-cell');
      cells.forEach(cell => {
        if (parseInt(cell.dataset.row) === row && parseInt(cell.dataset.col) === col) {
          cell.classList.add('selected');
        }
      });
    },
    
    // Check if target sum is reached
    checkTargetSum: function() {
      if (this.runningSum === this.targetSum) {
        uiManager.showMessage('Great job! You reached the target sum!');
        document.getElementById('next-level-btn').disabled = false;
        return true;
      } else if (this.runningSum > this.targetSum) {
        uiManager.showMessage('Sum exceeded! Try different numbers.');
        setTimeout(() => this.resetSelection(), 1500);
        return false;
      }
      return false;
    },
    
    // Helper function to check if two cells are neighbors
    isNeighbor: function(row1, col1, row2, col2) {
      const rowDiff = Math.abs(row1 - row2);
      const colDiff = Math.abs(col1 - col2);
      
      // Cells are neighbors if they share an edge (not diagonally)
      return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
  };