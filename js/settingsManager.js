// Settings Manager module - handles settings UI and changes
const settingsManager = {
    // Render the settings screen
    renderSettings: function() {
      document.getElementById('app-container').innerHTML = `
        <div class="settings-container">
          <h1 class="settings-title">Game Settings</h1>
          
          <div class="settings-group">
            <h3>General</h3>
            <div class="color-option">
              <label for="bg-color">Background Color:</label>
              <input type="color" id="bg-color" value="${gameState.settings.bgColor}">
            </div>
            <div class="color-option">
              <label for="text-color">Text Color:</label>
              <input type="color" id="text-color" value="${gameState.settings.textColor}">
            </div>
            <div class="color-option">
              <label for="accent-color">Accent Color:</label>
              <input type="color" id="accent-color" value="${gameState.settings.accentColor}">
            </div>
          </div>
          
          <div class="settings-group">
            <h3>Grid Appearance</h3>
            <div class="color-option">
              <label for="cell-bg-color">Cell Background:</label>
              <input type="color" id="cell-bg-color" value="${gameState.settings.cellBgColor}">
            </div>
            <div class="color-option">
              <label for="cell-border-color">Cell Border:</label>
              <input type="color" id="cell-border-color" value="${gameState.settings.cellBorderColor}">
            </div>
            <div class="color-option">
              <label for="number-color">Number Color:</label>
              <input type="color" id="number-color" value="${gameState.settings.numberColor}">
            </div>
            <div class="color-option">
              <label for="selected-cell-color">Selected Cell Color:</label>
              <input type="color" id="selected-cell-color" value="${gameState.settings.selectedCellColor}">
            </div>
          </div>
          
          <div class="settings-group">
            <h3>Edit Mode Colors</h3>
            <div class="color-option">
              <label for="edit-cell-bg-color">Edit Cell Background:</label>
              <input type="color" id="edit-cell-bg-color" value="${gameState.settings.editCellBgColor}">
            </div>
            <div class="color-option">
              <label for="edit-cell-border-color">Edit Cell Border:</label>
              <input type="color" id="edit-cell-border-color" value="${gameState.settings.editCellBorderColor}">
            </div>
            <div class="color-option">
              <label for="edit-number-color">Edit Number Color:</label>
              <input type="color" id="edit-number-color" value="${gameState.settings.editNumberColor}">
            </div>
            <div class="color-option">
              <label for="edit-selected-cell-color">Edit Selected Cell Color:</label>
              <input type="color" id="edit-selected-cell-color" value="${gameState.settings.editSelectedCellColor}">
            </div>
          </div>
          
          <div class="settings-group">
            <h3>Calculate Mode Colors</h3>
            <div class="color-option">
              <label for="calculate-cell-bg-color">Calculate Cell Background:</label>
              <input type="color" id="calculate-cell-bg-color" value="${gameState.settings.calculateCellBgColor}">
            </div>
            <div class="color-option">
              <label for="calculate-cell-border-color">Calculate Cell Border:</label>
              <input type="color" id="calculate-cell-border-color" value="${gameState.settings.calculateCellBorderColor}">
            </div>
            <div class="color-option">
              <label for="calculate-number-color">Calculate Number Color:</label>
              <input type="color" id="calculate-number-color" value="${gameState.settings.calculateNumberColor}">
            </div>
            <div class="color-option">
              <label for="calculate-selected-cell-color">Calculate Selected Cell Color:</label>
              <input type="color" id="calculate-selected-cell-color" value="${gameState.settings.calculateSelectedCellColor}">
            </div>
          </div>
          
          <div class="action-buttons">
            <button id="settings-back-btn">Back</button>
            <button id="reset-settings-btn">Reset to Default</button>
            <button id="save-settings-btn">Save Changes</button>
          </div>
        </div>
      `;
      
      // Add event listeners
      document.getElementById('settings-back-btn').addEventListener('click', () => {
        gameState.currentView = 'menu';
        uiManager.initUI();
      });
      
      document.getElementById('reset-settings-btn').addEventListener('click', () => {
        this.resetSettings();
      });
      
      document.getElementById('save-settings-btn').addEventListener('click', () => {
        this.saveSettings();
      });
      
      // Add event listeners for color inputs
      this.setupColorInputListeners();
    },
    
    // Set up color input change listeners
    setupColorInputListeners: function() {
      const colorInputs = [
        { id: 'bg-color', property: 'bgColor', cssVar: '--bg-color' },
        { id: 'text-color', property: 'textColor', cssVar: '--text-color' },
        { id: 'accent-color', property: 'accentColor', cssVar: '--accent-color' },
        { id: 'cell-bg-color', property: 'cellBgColor', cssVar: '--cell-bg-color' },
        { id: 'cell-border-color', property: 'cellBorderColor', cssVar: '--cell-border-color' },
        { id: 'number-color', property: 'numberColor', cssVar: '--number-color' },
        { id: 'selected-cell-color', property: 'selectedCellColor', cssVar: '--selected-cell-color' },
        { id: 'edit-cell-bg-color', property: 'editCellBgColor', cssVar: '--edit-cell-bg-color' },
        { id: 'edit-cell-border-color', property: 'editCellBorderColor', cssVar: '--edit-cell-border-color' },
        { id: 'edit-number-color', property: 'editNumberColor', cssVar: '--edit-number-color' },
        { id: 'edit-selected-cell-color', property: 'editSelectedCellColor', cssVar: '--edit-selected-cell-color' },
        { id: 'calculate-cell-bg-color', property: 'calculateCellBgColor', cssVar: '--calculate-cell-bg-color' },
        { id: 'calculate-cell-border-color', property: 'calculateCellBorderColor', cssVar: '--calculate-cell-border-color' },
        { id: 'calculate-number-color', property: 'calculateNumberColor', cssVar: '--calculate-number-color' },
        { id: 'calculate-selected-cell-color', property: 'calculateSelectedCellColor', cssVar: '--calculate-selected-cell-color' }
      ];
      
      colorInputs.forEach(input => {
        document.getElementById(input.id).addEventListener('input', (e) => {
          // Update the CSS variable directly for instant preview
          document.documentElement.style.setProperty(input.cssVar, e.target.value);
          
          // If accent color changes, update the hover color
          if (input.id === 'accent-color') {
            document.documentElement.style.setProperty('--accent-hover-color', 
              gameState.adjustColor(e.target.value, -20));
          }
          
          // If cell background changes, update the hover color
          if (input.id === 'cell-bg-color') {
            document.documentElement.style.setProperty('--cell-hover-color', 
              gameState.adjustColor(e.target.value, -10));
          }
        });
      });
    },
    
    // Save settings to game state and localStorage
    saveSettings: function() {
      // Update game state with current values
      gameState.settings.bgColor = document.getElementById('bg-color').value;
      gameState.settings.textColor = document.getElementById('text-color').value;
      gameState.settings.accentColor = document.getElementById('accent-color').value;
      gameState.settings.cellBgColor = document.getElementById('cell-bg-color').value;
      gameState.settings.cellBorderColor = document.getElementById('cell-border-color').value;
      gameState.settings.numberColor = document.getElementById('number-color').value;
      gameState.settings.selectedCellColor = document.getElementById('selected-cell-color').value;
      gameState.settings.editCellBgColor = document.getElementById('edit-cell-bg-color').value;
      gameState.settings.editCellBorderColor = document.getElementById('edit-cell-border-color').value;
      gameState.settings.editNumberColor = document.getElementById('edit-number-color').value;
      gameState.settings.editSelectedCellColor = document.getElementById('edit-selected-cell-color').value;
      gameState.settings.calculateCellBgColor = document.getElementById('calculate-cell-bg-color').value;
      gameState.settings.calculateCellBorderColor = document.getElementById('calculate-cell-border-color').value;
      gameState.settings.calculateNumberColor = document.getElementById('calculate-number-color').value;
      gameState.settings.calculateSelectedCellColor = document.getElementById('calculate-selected-cell-color').value;
      
      // Save to localStorage
      gameState.saveSettings();
      
      // Show confirmation message
      alert('Settings saved successfully!');
      
      // Return to menu
      gameState.currentView = 'menu';
      uiManager.initUI();
    },
    
    // Reset settings to default values
    resetSettings: function() {
      const defaultSettings = {
        bgColor: '#f8f8f8',
        textColor: '#333333',
        accentColor: '#0080ff',
        cellBgColor: '#f0f0f0',
        cellBorderColor: '#cccccc',
        numberColor: '#333333',
        selectedCellColor: '#b3e0ff',
        editCellBgColor: '#ffffff',
        editCellBorderColor: '#000000',
        editNumberColor: '#000000',
        editSelectedCellColor: '#ff0000',
        calculateCellBgColor: '#ffffff',
        calculateCellBorderColor: '#000000',
        calculateNumberColor: '#000000',
        calculateSelectedCellColor: '#00ff00'
      };
      
      // Update form values
      document.getElementById('bg-color').value = defaultSettings.bgColor;
      document.getElementById('text-color').value = defaultSettings.textColor;
      document.getElementById('accent-color').value = defaultSettings.accentColor;
      document.getElementById('cell-bg-color').value = defaultSettings.cellBgColor;
      document.getElementById('cell-border-color').value = defaultSettings.cellBorderColor;
      document.getElementById('number-color').value = defaultSettings.numberColor;
      document.getElementById('selected-cell-color').value = defaultSettings.selectedCellColor;
      document.getElementById('edit-cell-bg-color').value = defaultSettings.editCellBgColor;
      document.getElementById('edit-cell-border-color').value = defaultSettings.editCellBorderColor;
      document.getElementById('edit-number-color').value = defaultSettings.editNumberColor;
      document.getElementById('edit-selected-cell-color').value = defaultSettings.editSelectedCellColor;
      document.getElementById('calculate-cell-bg-color').value = defaultSettings.calculateCellBgColor;
      document.getElementById('calculate-cell-border-color').value = defaultSettings.calculateCellBorderColor;
      document.getElementById('calculate-number-color').value = defaultSettings.calculateNumberColor;
      document.getElementById('calculate-selected-cell-color').value = defaultSettings.calculateSelectedCellColor;
      
      // Apply to preview
      document.documentElement.style.setProperty('--bg-color', defaultSettings.bgColor);
      document.documentElement.style.setProperty('--text-color', defaultSettings.textColor);
      document.documentElement.style.setProperty('--accent-color', defaultSettings.accentColor);
      document.documentElement.style.setProperty('--accent-hover-color', gameState.adjustColor(defaultSettings.accentColor, -20));
      document.documentElement.style.setProperty('--cell-bg-color', defaultSettings.cellBgColor);
      document.documentElement.style.setProperty('--cell-border-color', defaultSettings.cellBorderColor);
      document.documentElement.style.setProperty('--cell-hover-color', gameState.adjustColor(defaultSettings.cellBgColor, -10));
      document.documentElement.style.setProperty('--number-color', defaultSettings.numberColor);
      document.documentElement.style.setProperty('--selected-cell-color', defaultSettings.selectedCellColor);
      document.documentElement.style.setProperty('--edit-cell-bg-color', defaultSettings.editCellBgColor);
      document.documentElement.style.setProperty('--edit-cell-border-color', defaultSettings.editCellBorderColor);
      document.documentElement.style.setProperty('--edit-number-color', defaultSettings.editNumberColor);
      document.documentElement.style.setProperty('--edit-selected-cell-color', defaultSettings.editSelectedCellColor);
      document.documentElement.style.setProperty('--calculate-cell-bg-color', defaultSettings.calculateCellBgColor);
      document.documentElement.style.setProperty('--calculate-cell-border-color', defaultSettings.calculateCellBorderColor);
      document.documentElement.style.setProperty('--calculate-number-color', defaultSettings.calculateNumberColor);
      document.documentElement.style.setProperty('--calculate-selected-cell-color', defaultSettings.calculateSelectedCellColor);
    }
  };