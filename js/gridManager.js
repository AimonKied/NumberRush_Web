// Grid Manager module - handles the grid creation and interactions
const gridManager = {
  // Create the 8x8 grid
  createGrid: function() {
    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer) return; // Sicherheitscheck

    gridContainer.innerHTML = '';
    gameState.grid = []; // Reset grid array
    
    for (let row = 0; row < 8; row++) {
      gameState.grid[row] = [];
      for (let col = 0; col < 8; col++) {
        // Create a cell with random number
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        // Generate random number (1-9 instead of 0-9)
        const number = Math.floor(Math.random() * 9) + 1;
        gameState.grid[row][col] = number;
        
        cell.textContent = number;
        
        // Add event listener for cell click
        cell.addEventListener('click', () => this.handleCellClick(row, col));
        
        gridContainer.appendChild(cell);
      }
    }
  },

  // Handle cell click based on current mode
  handleCellClick: function(row, col) {
    if (gameState.mode === 'edit') {
      this.handleEditModeClick(row, col);
    } else if (gameState.mode === 'calculate') {
      this.handleCalculateModeClick(row, col);
    }
  },

  // Handle clicks in edit mode
  handleEditModeClick: function(row, col) {
    // If no cell selected yet, select this one
    if (gameState.selectedCells.length === 0) {
      gameState.selectCell(row, col);
      return;
    }
    
    // Check if this cell is a neighbor of the selected cell
    const firstCell = gameState.selectedCells[0];
    if (gameState.isNeighbor(firstCell.row, firstCell.col, row, col)) {
      // Swap the values of the two cells
      const temp = gameState.grid[firstCell.row][firstCell.col];
      gameState.grid[firstCell.row][firstCell.col] = gameState.grid[row][col];
      gameState.grid[row][col] = temp;
      
      // Update the grid display
      this.updateGridDisplay();
      
      // Show a message about the swap
      uiManager.showMessage('Numbers swapped successfully');
      
      // Reset selection
      gameState.resetSelection();
    } else {
      // If not a neighbor, reset selection and select this cell instead
      gameState.resetSelection();
      gameState.selectCell(row, col);
    }
  },

  // Handle clicks in calculate mode
  handleCalculateModeClick: function(row, col) {
    const cellValue = gameState.grid[row][col];
    
    // Check if this is the first number or if it's a neighbor of the last selected number
    const lastSlot = gameState.calculationSlots.filter(slot => slot !== null).pop();
    if (lastSlot && !gameState.isNeighbor(lastSlot.row, lastSlot.col, row, col)) {
      uiManager.showMessage('You can only select neighboring numbers!');
      return;
    }
    
    // Add number to next empty slot
    if (gameState.addNumberToSlot(row, col, cellValue)) {
      // Highlight the cell
      const cells = document.querySelectorAll('.grid-cell');
      cells.forEach(cell => {
        if (parseInt(cell.dataset.row) === row && parseInt(cell.dataset.col) === col) {
          cell.classList.add('selected');
        }
      });
      
      // Update the UI
      uiManager.updateCalculationSlots();
    } else {
      uiManager.showMessage('All calculation slots are filled. Reset to try again.');
    }
  },

  // Update the grid display to reflect the current state
  updateGridDisplay: function() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      cell.textContent = gameState.grid[row][col];
    });
  }
};