// UI Manager module - handles UI updates and rendering
const uiManager = {
    // Initialize the game UI
    initUI: function() {
      document.getElementById('game-container').innerHTML = `
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
          <button id="reset-btn">Reset Selection</button>
          <button id="next-level-btn" disabled>Next Level</button>
        </div>
      `;
  
      // Set up event listeners
      this.setupEventListeners();
    },
  
    // Set up event listeners for UI elements
    setupEventListeners: function() {
      document.getElementById('edit-mode-btn').addEventListener('click', () => modeManager.setMode('edit'));
      document.getElementById('calculate-mode-btn').addEventListener('click', () => modeManager.setMode('calculate'));
      document.getElementById('reset-btn').addEventListener('click', () => gameState.resetSelection());
      document.getElementById('next-level-btn').addEventListener('click', () => levelManager.nextLevel());
    },
  
    // Display a message in the status area
    showMessage: function(message) {
      const statusMessage = document.getElementById('status-message');
      statusMessage.textContent = message;
      
      // Clear message after a delay
      setTimeout(() => {
        statusMessage.textContent = '';
      }, 3000);
    },
  
    // Update the displayed running sum
    updateRunningSum: function() {
      document.getElementById('running-sum').textContent = `Current Sum: ${gameState.runningSum}`;
    },
  
    // Update the level info display
    updateLevelInfo: function() {
      document.querySelector('.level-info span:first-child').textContent = `Level: ${gameState.level}`;
      document.querySelector('.level-info span:last-child').textContent = `Target Sum: ${gameState.targetSum}`;
      document.getElementById('next-level-btn').disabled = true;
    },
  
    // Update mode button appearance
    updateModeButtons: function(mode) {
      document.getElementById('edit-mode-btn').classList.toggle('active', mode === 'edit');
      document.getElementById('calculate-mode-btn').classList.toggle('active', mode === 'calculate');
    }
  };