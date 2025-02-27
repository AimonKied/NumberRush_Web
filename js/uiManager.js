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
            <span>Max Numbers: ${gameState.maxOperands}</span>
          </div>
          <div class="mode-controls">
            <button id="edit-mode-btn" class="active">Edit Mode</button>
            <button id="calculate-mode-btn">Calculate Mode</button>
          </div>
          <div id="operation-controls" class="operation-controls" style="display:none;">
            <span>Operation:</span>
            <button id="add-op-btn" class="op-btn active">+</button>
            <button id="subtract-op-btn" class="op-btn">-</button>
            <button id="multiply-op-btn" class="op-btn">*</button>
            <button id="divide-op-btn" class="op-btn">/</button>
          </div>
          <div class="status">
            <span id="running-sum">Current Result: ${gameState.runningSum}</span>
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
      document.getElementById('operation-controls').style.display = 'none';
    });
    
    document.getElementById('calculate-mode-btn').addEventListener('click', () => {
      modeManager.setMode('calculate');
      document.getElementById('game-container').classList.add('calculate-mode');
      document.getElementById('game-container').classList.remove('edit-mode');
      document.getElementById('operation-controls').style.display = 'flex';
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
    
    // Add event listeners for operation buttons
    document.getElementById('add-op-btn').addEventListener('click', () => gameState.setOperation('+'));
    document.getElementById('subtract-op-btn').addEventListener('click', () => gameState.setOperation('-'));
    document.getElementById('multiply-op-btn').addEventListener('click', () => gameState.setOperation('*'));
    document.getElementById('divide-op-btn').addEventListener('click', () => gameState.setOperation('/'));
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
      runningSum.textContent = `Current Result: ${gameState.runningSum}`;
    }
  },

  // Update the level info display
  updateLevelInfo: function() {
    const levelInfo = document.querySelector('.level-info');
    if (levelInfo) {
      levelInfo.innerHTML = `
        <span>Level: ${gameState.level}</span>
        <span>Target Sum: ${gameState.targetSum}</span>
        <span>Max Numbers: ${gameState.maxOperands}</span>
      `;
      
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
      
      // Show/hide operation controls based on mode
      const operationControls = document.getElementById('operation-controls');
      if (operationControls) {
        operationControls.style.display = mode === 'calculate' ? 'flex' : 'none';
      }
    }
  },
  
  // Update operation button appearance
  updateOperationButtons: function(operation) {
    const addButton = document.getElementById('add-op-btn');
    const subtractButton = document.getElementById('subtract-op-btn');
    const multiplyButton = document.getElementById('multiply-op-btn');
    const divideButton = document.getElementById('divide-op-btn');
    
    if (addButton && subtractButton && multiplyButton && divideButton) {
      addButton.classList.toggle('active', operation === '+');
      subtractButton.classList.toggle('active', operation === '-');
      multiplyButton.classList.toggle('active', operation === '*');
      divideButton.classList.toggle('active', operation === '/');
    }
  },
  
  // Navigate to a different view
  navigateTo: function(view) {
    gameState.currentView = view;
    this.initUI();
  }
};