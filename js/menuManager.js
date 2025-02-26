// Menu Manager module - handles main menu and navigation
const menuManager = {
    // Render the main menu
    renderMainMenu: function() {
      document.getElementById('app-container').innerHTML = `
        <div class="menu-container">
          <h1 class="menu-title">NumberRush</h1>
          <div class="menu-buttons">
            <button id="play-btn" class="menu-button">Play</button>
            <button id="levels-btn" class="menu-button">Levels</button>
            <button id="settings-btn" class="menu-button">Settings</button>
          </div>
        </div>
      `;
      
      // Add event listeners
      document.getElementById('play-btn').addEventListener('click', () => {
        // Start with the current or first level
        levelManager.loadLevel(gameState.level);
        gameState.currentView = 'game';
        uiManager.initUI();
        gameGridManager.loadGrid();
      });
      
      document.getElementById('levels-btn').addEventListener('click', () => {
        gameState.currentView = 'levels';
        uiManager.initUI();
      });
      
      document.getElementById('settings-btn').addEventListener('click', () => {
        gameState.currentView = 'settings';
        uiManager.initUI();
      });
    },
    
    // Render the level selection screen
    renderLevelSelection: function() {
      let levelsHTML = '<div class="level-grid">';
      
      // Create 20 level buttons
      for (let i = 1; i <= 20; i++) {
        const isLocked = i > gameState.maxUnlockedLevel;
        levelsHTML += `
          <button 
            id="level-${i}" 
            class="level-btn ${isLocked ? 'locked' : ''}" 
            ${isLocked ? 'disabled' : ''}
          >
            ${isLocked ? '🔒' : i}
          </button>
        `;
      }
      
      levelsHTML += '</div>';
      
      document.getElementById('app-container').innerHTML = `
        <div class="level-selection">
          <h1>Select Level</h1>
          ${levelsHTML}
          <button id="back-btn" class="back-button">Back to Menu</button>
        </div>
      `;
      
      // Add event listeners for levels
      for (let i = 1; i <= gameState.maxUnlockedLevel; i++) {
        document.getElementById(`level-${i}`).addEventListener('click', () => {
          levelManager.loadLevel(i);
          gameState.currentView = 'game';
          uiManager.initUI();
          gameGridManager.loadGrid();
        });
      }
      
      // Back button
      document.getElementById('back-btn').addEventListener('click', () => {
        gameState.currentView = 'menu';
        uiManager.initUI();
      });
    }
  };