// Game state module - manages the core game state
const gameState = {
  // Game data
  grid: [],                  // 8x8 grid with numbers 0-9
  mode: 'edit',              // 'edit' or 'calculate'
  targetSum: 0,              // Target sum for the level
  level: 1,                  // Current level
  selectedCells: [],         // Currently selected cells for calculation
  runningSum: 0,             // Current sum of selected cells
  
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
  },
  
  // Current view
  currentView: 'menu',       // 'menu', 'game', 'levels', 'settings'
  
  // Initialize the game state
  init: function() {
    // Load saved data from localStorage if available
    this.loadProgress();
    this.loadSettings();
    this.applySettings();
  },
  
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
      
      // Unlock next level if this is the highest completed level
      if (this.level === this.maxUnlockedLevel) {
        this.maxUnlockedLevel++;
        this.saveProgress();
      }
      
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