// UI Manager module - handles UI updates and rendering
const uiManager = {
  // Initialize the UI based on current view
  initUI: function() {
    // Render the appropriate view
    switch (gameState.currentView) {
      case 'menu':
        menuManager.renderMainMenu();
        break;
      case 'levels':
        menuManager.renderLevelSelection();
        break;
      case 'settings':
        settingsManager.renderSettings();
        break;
      case 'game':
        this.renderGameUI();
        break;
    }
  },
  
  // Render the game UI
  renderGameUI: function() {
    document.getElementById('app-container').innerHTML = `
      <div id="game-container">
        <div class="game-header">
          <h1>NumberRush</h1>
          <div class="level-info">
            <span>Level: ${gameState.level}</span>
            <span>Target Sum: ${gameState.targetSum}</span>
          </div>
          <div class="mode-controls">
            <button id="edit-mode-btn" class="active">Edit Mode</button>
            <button id="calculate-mode-btn">Calculate Mode</button>
          </div>
          <div class="status">
            <span id="running-sum">Current Sum: ${gameState.runningSum}</span>
            <span id="status-message"></span>
          </div>
        </div>
        <div id="grid-container" class="grid-container"></div>
        <div class="action-buttons">
          <button id="menu-btn">Back to Menu</button>
          <button id="reset-btn">Reset Selection</button>
          <button id="next-level-btn" disabled>Next Level</button>
        </div>
      </div>
    `;

    // Set up event listeners
    this.setupGameEventListeners();
    
    // Create the game grid
    gridManager.createGrid();
  },

  // Set up event listeners for game UI elements
  setupGameEventListeners: function() {
    document.getElementById('edit-mode-btn').addEventListener('click', () => {
      modeManager.setMode('edit');
      document.getElementById('game-container').classList.add('edit-mode');
      document.getElementById('game-container').classList.remove('calculate-mode');
    });
    document.getElementById('calculate-mode-btn').addEventListener('click', () => {
      modeManager.setMode('calculate');
      document.getElementById('game-container').classList.add('calculate-mode');
      document.getElementById('game-container').classList.remove('edit-mode');
    });
    document.getElementById('reset-btn').addEventListener('click', () => gameState.resetSelection());
    document.getElementById('next-level-btn').addEventListener('click', () => {
      levelManager.loadLevel(gameState.level + 1);
      gameState.currentView = 'game';
      this.initUI();
    });
    document.getElementById('menu-btn').addEventListener('click', () => {
      gameState.currentView = 'menu';
      this.initUI();
    });
  },

  // Display a message in the status area
  showMessage: function(message) {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
      statusMessage.textContent = message;
      
      // Clear message after a delay
      setTimeout(() => {
        if (statusMessage) {
          statusMessage.textContent = '';
        }
      }, 3000);
    }
  },

  // Update the displayed running sum
  updateRunningSum: function() {
    const runningSum = document.getElementById('running-sum');
    if (runningSum) {
      runningSum.textContent = `Current Sum: ${gameState.runningSum}`;
    }
  },

  // Update the level info display
  updateLevelInfo: function() {
    const levelInfo = document.querySelector('.level-info');
    if (levelInfo) {
      levelInfo.querySelector('span:first-child').textContent = `Level: ${gameState.level}`;
      levelInfo.querySelector('span:last-child').textContent = `Target Sum: ${gameState.targetSum}`;
      
      const nextLevelBtn = document.getElementById('next-level-btn');
      if (nextLevelBtn) {
        nextLevelBtn.disabled = true;
      }
    }
  },

  // Update mode button appearance
  updateModeButtons: function(mode) {
    const editButton = document.getElementById('edit-mode-btn');
    const calculateButton = document.getElementById('calculate-mode-btn');
    
    if (editButton && calculateButton) {
      editButton.classList.toggle('active', mode === 'edit');
      calculateButton.classList.toggle('active', mode === 'calculate');
    }
  },
  
  // Navigate to a different view
  navigateTo: function(view) {
    gameState.currentView = view;
    this.initUI();
  }
};