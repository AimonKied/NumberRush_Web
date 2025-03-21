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
          <div class="calculation-wrapper">
            <div id="operation-controls" class="operation-controls">
              <div class="op-btn" draggable="true" data-op="+">+</div>
              <div class="op-btn" draggable="true" data-op="-">-</div>
              <div class="op-btn" draggable="true" data-op="*">×</div>
              <div class="op-btn" draggable="true" data-op="/">÷</div>
            </div>
            <div class="calculation-area">
              <div id="calculation-slots" class="calculation-slots"></div>
              <div class="equals-sign">=</div>
              <div class="target-slot">${gameState.targetSum}</div>
            </div>
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

    // Set up event listeners first
    this.setupGameEventListeners();
    
    // Initialize grid ONLY ONCE
    gridManager.createGrid();
  },

  // Set up event listeners for game UI elements
  setupGameEventListeners: function() {
    // Mode buttons
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

    // Operation controls
    const operators = document.querySelectorAll('.op-btn');
    operators.forEach(op => {
      op.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', op.dataset.op);
      });
    });

    // Removed duplicate grid creation from here
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
  },

  // Update the calculation slots display
  updateCalculationSlots: function() {
    const slotsContainer = document.getElementById('calculation-slots');
    if (!slotsContainer) return;
    
    let html = '';
    for (let i = 0; i < gameState.maxOperands; i++) {
      // Add number slot (ohne target sum in leeren slots)
      const slot = gameState.calculationSlots[i];
      html += `
        <div class="calc-slot number-slot ${slot ? 'filled' : 'empty'}" 
             data-index="${i}">
          ${slot ? slot.value : ''}
        </div>`;
      
      // Add operator slot after each number except the last
      if (i < gameState.maxOperands - 1) {
        const op = gameState.operatorSlots[i];
        html += `
          <div class="calc-slot operator-slot ${op ? 'filled' : 'empty'}" 
               data-index="${i}"
               ondragover="event.preventDefault()"
               ondrop="gameState.handleOperatorDrop(event, ${i})">
            ${op || '?'}
          </div>`;
      }
    }
    
    slotsContainer.innerHTML = html;
    
    // Update target sum in result slot
    const targetSlot = document.querySelector('.target-slot');
    if (targetSlot) {
      targetSlot.textContent = gameState.targetSum;
    }
  }
};