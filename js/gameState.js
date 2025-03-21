// Game state module - manages the core game state
const gameState = {
  // Game data
  grid: [],                  // 8x8 grid with numbers 0-9
  mode: 'edit',              // 'edit' or 'calculate'
  targetSum: 0,              // Target sum for the level
  level: 1,                  // Current level
  selectedCells: [],         // Currently selected cells for calculation
  runningSum: 0,             // Current sum of selected cells
  currentOperation: '+',     // Current selected operation (+, -, *, /)
  maxOperands: 2,            // Maximum number of operands allowed (updated based on level)
  calculationSlots: [],      // Array to hold the calculation slots
  operatorSlots: [],         // Array to hold operators between numbers
  
  // Game progress
  maxUnlockedLevel: 1,       // Highest level unlocked
  
  // Settings
  settings: {
    bgColor: '#f8f8f8',      // Background color
    textColor: '#333333',    // Text color
    accentColor: '#0080ff',  // Accent color for buttons, etc.
    cellBgColor: '#f0f0f0',  // Cell background color
    cellBorderColor: '#cccccc', // Cell border color
    numberColor: '#333333',  // Number color
    selectedCellColor: '#b3e0ff', // Selected cell color
    editCellBgColor: '#f0f0f0', // Edit mode cell background color
    editCellBorderColor: '#cccccc', // Edit mode cell border color
    editNumberColor: '#333333', // Edit mode number color
    editSelectedCellColor: '#b3e0ff', // Edit mode selected cell color
    calculateCellBgColor: '#e0f7fa', // Calculate mode cell background color
    calculateCellBorderColor: '#80deea', // Calculate mode cell border color
    calculateNumberColor: '#00796b', // Calculate mode number color
    calculateSelectedCellColor: '#4dd0e1' // Calculate mode selected cell color
  },
  
  // Current view
  currentView: 'menu',       // 'menu', 'game', 'levels', 'settings'
  
  // Initialize the game state
  init: function() {
    // Load saved data from localStorage if available
    this.loadProgress();
    this.loadSettings();
    this.applySettings();
    this.resetCalculationSlots();
    this.operatorSlots = Array(this.maxOperands - 1).fill(null);
  },
  
  // Reset selections and current sum
  resetSelection: function() {
    this.selectedCells = [];
    this.runningSum = 0;
    this.resetCalculationSlots();
    uiManager.updateRunningSum();
    
    // Update visual appearance
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
      cell.classList.remove('selected');
    });
    
    uiManager.updateCalculationSlots();
    uiManager.showMessage('Selection reset');
  },
  
  // Initialize calculation slots based on maxOperands
  resetCalculationSlots: function() {
    this.calculationSlots = Array(this.maxOperands).fill(null);
    this.operatorSlots = Array(this.maxOperands - 1).fill(null);
  },
  
  // Add a selected number to the next empty slot
  addNumberToSlot: function(row, col, number) {
    const emptySlotIndex = this.calculationSlots.findIndex(slot => slot === null);
    if (emptySlotIndex === -1) return false;
    
    this.calculationSlots[emptySlotIndex] = {
      row: row,
      col: col,
      value: number
    };
    
    // Recalculate running sum
    this.recalculateSum();
    return true;
  },
  
  // Handle operator drop
  handleOperatorDrop: function(event, index) {
    event.preventDefault();
    const operator = event.dataTransfer.getData('text/plain');
    this.operatorSlots[index] = operator;
    this.recalculateSum();
    uiManager.updateCalculationSlots();
  },
  
  // Recalculate the sum based on filled slots
  recalculateSum: function() {
    this.runningSum = 0;
    const filledSlots = this.calculationSlots.filter(slot => slot !== null);
    
    filledSlots.forEach((slot, index) => {
      if (index === 0) {
        this.runningSum = slot.value;
      } else {
        const operator = this.operatorSlots[index - 1];
        if (!operator) return;
        
        switch(operator) {
          case '+': 
            this.runningSum += slot.value; 
            break;
          case '-': 
            this.runningSum -= slot.value; 
            break;
          case '*': 
            this.runningSum *= slot.value; 
            break;
          case '/':
            if (slot.value === 0) {
              uiManager.showMessage('Cannot divide by zero!');
              return;
            }
            // Round to prevent floating point issues
            this.runningSum = Math.round((this.runningSum / slot.value) * 100) / 100;
            break;
        }
      }
    });
    
    uiManager.updateRunningSum();
    
    // Check if we should validate the result
    if (filledSlots.length === this.maxOperands && 
        this.operatorSlots.every((op, i) => i >= filledSlots.length - 1 || op !== null)) {
      this.checkTargetSum();
    }
    
    return true;
  },
  
  // Add a cell to selection
  selectCell: function(row, col) {
    // Check if we've reached the maximum number of operands
    if (this.selectedCells.length >= this.maxOperands) {
      uiManager.showMessage(`Maximum of ${this.maxOperands} numbers allowed for level ${this.level}`);
      return false;
    }
    
    this.selectedCells.push({row, col});
    
    // Update visual appearance
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
      if (parseInt(cell.dataset.row) === row && parseInt(cell.dataset.col) === col) {
        cell.classList.add('selected');
      }
    });
    
    return true;
  },
  
  // Apply the current operation to update the running sum
  applyOperation: function(value) {
    if (this.selectedCells.length === 1) {
      // First number just becomes the running sum
      this.runningSum = value;
    } else {
      // Apply the operation based on the current selected operation
      switch(this.currentOperation) {
        case '+':
          this.runningSum += value;
          break;
        case '-':
          this.runningSum -= value;
          break;
        case '*':
          this.runningSum *= value;
          break;
        case '/':
          // Check for division by zero
          if (value === 0) {
            uiManager.showMessage('Cannot divide by zero!');
            return false;
          }
          // Round to 2 decimal places to prevent floating point issues
          this.runningSum = Math.round((this.runningSum / value) * 100) / 100;
          break;
      }
    }
    
    uiManager.updateRunningSum();
    return true;
  },
  
  // Set the current operation
  setOperation: function(op) {
    this.currentOperation = op;
    uiManager.updateOperationButtons(op);
    uiManager.updateCalculationSlots(); // Add this line
    uiManager.showMessage(`Operation set to ${op}`);
  },
  
  // Check if target sum is reached
  checkTargetSum: function() {
    // Check if all slots are filled
    const allSlotsFilled = !this.calculationSlots.includes(null);
    if (!allSlotsFilled) {
      return false;
    }
    
    if (Math.abs(this.runningSum - this.targetSum) < 0.0001) { // Use small epsilon for float comparison
      uiManager.showMessage('Great job! You reached the target sum!');
      document.getElementById('next-level-btn').disabled = false;
      
      // Unlock next level if this is the highest completed level
      if (this.level === this.maxUnlockedLevel) {
        this.maxUnlockedLevel++;
        this.saveProgress();
      }
      
      return true;
    } else {
      uiManager.showMessage(`Target not reached. Try different numbers or operations.`);
      setTimeout(() => this.resetSelection(), 1500);
      return false;
    }
  },
  
  // Helper function to check if two cells are neighbors
  isNeighbor: function(row1, col1, row2, col2) {
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    
    // Cells are neighbors if they share an edge (not diagonally)
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  },
  
  // Save game progress to localStorage
  saveProgress: function() {
    localStorage.setItem('numberRush_progress', JSON.stringify({
      maxUnlockedLevel: this.maxUnlockedLevel
    }));
  },
  
  // Load game progress from localStorage
  loadProgress: function() {
    const savedProgress = localStorage.getItem('numberRush_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      this.maxUnlockedLevel = progress.maxUnlockedLevel;
    }
  },
  
  // Save settings to localStorage
  saveSettings: function() {
    localStorage.setItem('numberRush_settings', JSON.stringify(this.settings));
  },
  
  // Load settings from localStorage
  loadSettings: function() {
    const savedSettings = localStorage.getItem('numberRush_settings');
    if (savedSettings) {
      this.settings = {...this.settings, ...JSON.parse(savedSettings)};
    }
  },
  
  // Apply current settings to the UI
  applySettings: function() {
    document.documentElement.style.setProperty('--bg-color', this.settings.bgColor);
    document.documentElement.style.setProperty('--text-color', this.settings.textColor);
    document.documentElement.style.setProperty('--accent-color', this.settings.accentColor);
    document.documentElement.style.setProperty('--accent-hover-color', this.adjustColor(this.settings.accentColor, -20));
    document.documentElement.style.setProperty('--cell-bg-color', this.settings.cellBgColor);
    document.documentElement.style.setProperty('--cell-border-color', this.settings.cellBorderColor);
    document.documentElement.style.setProperty('--cell-hover-color', this.adjustColor(this.settings.cellBgColor, -10));
    document.documentElement.style.setProperty('--number-color', this.settings.numberColor);
    document.documentElement.style.setProperty('--selected-cell-color', this.settings.selectedCellColor);
    document.documentElement.style.setProperty('--edit-cell-bg-color', this.settings.editCellBgColor);
    document.documentElement.style.setProperty('--edit-cell-border-color', this.settings.editCellBorderColor);
    document.documentElement.style.setProperty('--edit-number-color', this.settings.editNumberColor);
    document.documentElement.style.setProperty('--edit-selected-cell-color', this.settings.editSelectedCellColor);
    document.documentElement.style.setProperty('--calculate-cell-bg-color', this.settings.calculateCellBgColor);
    document.documentElement.style.setProperty('--calculate-cell-border-color', this.settings.calculateCellBorderColor);
    document.documentElement.style.setProperty('--calculate-number-color', this.settings.calculateNumberColor);
    document.documentElement.style.setProperty('--calculate-selected-cell-color', this.settings.calculateSelectedCellColor);
  },
  
  // Helper to darken/lighten a color
  adjustColor: function(color, amount) {
    // Convert hex to RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);
    
    // Adjust values
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
};