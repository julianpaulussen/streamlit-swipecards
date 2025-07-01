// The `Streamlit` object exists because our html file includes
// `streamlit-component-lib.js`.
// If you get an error about "Streamlit" not being defined, that
// means you're missing that file.

function sendValue(value) {
  Streamlit.setComponentValue(value)
}

// Theme detection and application
function detectAndApplyTheme() {
  // Try to detect theme from Streamlit's CSS variables or parent styles
  let isDark = false;
  
  try {
    // Multiple detection methods for robustness
    const parentDoc = window.parent.document;
    
    // Method 1: Check for explicit theme attributes
    if (parentDoc.documentElement.hasAttribute('data-theme')) {
      isDark = parentDoc.documentElement.getAttribute('data-theme') === 'dark';
    }
    // Method 2: Check for dark class names
    else if (parentDoc.documentElement.classList.contains('dark') || 
             parentDoc.body.classList.contains('dark-theme') ||
             parentDoc.body.classList.contains('dark')) {
      isDark = true;
    }
    // Method 3: Check Streamlit app background color
    else {
      const streamlitApp = parentDoc.querySelector('.stApp, .main, [data-testid="stAppViewContainer"], .css-1d391kg, .css-fg4pbf');
      if (streamlitApp) {
        const computedStyle = window.parent.getComputedStyle(streamlitApp);
        const bgColor = computedStyle.backgroundColor;
        
        // Parse RGB to determine brightness
        const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          isDark = brightness < 128;
        }
        // Check for known dark colors
        else if (bgColor.includes('14, 17, 23') || bgColor.includes('38, 39, 48') || bgColor.includes('11, 11, 11')) {
          isDark = true;
        }
      }
    }
    
    // Method 4: Check CSS custom properties
    if (!isDark) {
      const rootStyle = window.parent.getComputedStyle(parentDoc.documentElement);
      const colorScheme = rootStyle.getPropertyValue('color-scheme');
      if (colorScheme === 'dark') {
        isDark = true;
      }
    }
  } catch (e) {
    console.log('Theme detection fallback:', e);
    // Fallback: use system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    isDark = mediaQuery.matches;
  }
  
  // Apply theme to the document
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  
  // Also set it on body for compatibility
  document.body.className = isDark ? 'dark-theme' : 'light-theme';
  
  console.log('Applied theme:', isDark ? 'dark' : 'light');
  return isDark;
}

class SwipeCards {
src/streamlit_swipecards/__init__.py  constructor(container, cards, tableData = null, highlightCells = [], highlightRows = [], highlightColumns = [], displayMode = 'cards', centerTableRow = null, centerTableColumn = null) {
    this.container = container;
    this.cards = cards;
    this.tableData = tableData;
    this.highlightCells = highlightCells;
    this.highlightRows = highlightRows;
    this.highlightColumns = highlightColumns;
    this.displayMode = displayMode;
    this.centerTableRow = centerTableRow;
    this.centerTableColumn = centerTableColumn;
    this.currentIndex = 0;
    this.swipedCards = [];
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.lastAction = null; // Store the last action without sending immediately
    this.agGridInstances = new Map(); // Store AG-Grid instances for cleanup
    
    this.init();
  }
  
  init() {
    // Apply theme detection
    detectAndApplyTheme();
    this.render();
    this.bindEvents();
  }
  
  render() {
    console.log('Rendering cards. CurrentIndex:', this.currentIndex, 'Total cards:', this.cards.length, 'Display mode:', this.displayMode);
    
    // Clean up existing AG-Grid instances
    this.cleanupAgGrids();
    
    if (this.currentIndex >= this.cards.length) {
      this.container.innerHTML = `
        <div class="no-more-cards">
          <h3>🎉 All done!</h3>
          <p>No more cards to swipe</p>
          <div class="results-section">
            <button class="results-btn" onclick="swipeCards.getResults()">📊 Get Results</button>
            <div class="swipe-counter">Total swiped: ${this.swipedCards.length}</div>
          </div>
        </div>
      `;
      return;
    }
    
    let cardsHTML = '';
    
    // Show up to 3 cards in the stack
    for (let i = 0; i < Math.min(3, this.cards.length - this.currentIndex); i++) {
      const cardIndex = this.currentIndex + i;
      const card = this.cards[cardIndex];
      
      console.log('Creating card for index:', cardIndex, 'Display mode:', this.displayMode);
      
      // Add position classes for consistent sizing
      let positionClass = '';
      if (i === 0) positionClass = 'card-front';
      else if (i === 1) positionClass = 'card-second';
      else if (i === 2) positionClass = 'card-third';
      
      let cardContent = '';
      
      if (this.displayMode === 'table' && card.data) {
        // Render table card
        cardContent = this.renderTableCard(card, cardIndex);
      } else {
        // Render traditional image card
        cardContent = this.renderImageCard(card);
      }
      
      cardsHTML += `
        <div class="swipe-card ${positionClass}" data-index="${cardIndex}">
          ${cardContent}
          <div class="action-indicator like">💚</div>
          <div class="action-indicator pass">❌</div>
        </div>
      `;
    }
    
    this.container.innerHTML = `
      <div class="cards-stack">
        ${cardsHTML}
      </div>
      <div class="action-buttons">
        <button class="action-btn btn-pass" onclick="swipeCards.swipeLeft()">❌</button>
        <button class="action-btn btn-back" onclick="swipeCards.goBack()">↶</button>
        <button class="action-btn btn-like" onclick="swipeCards.swipeRight()">💚</button>
      </div>
      <div class="results-section">
        <button class="results-btn" onclick="swipeCards.getResults()">📊 Get Results</button>
        <div class="swipe-counter">Swiped: ${this.swipedCards.length} | Remaining: ${this.cards.length - this.currentIndex}</div>
      </div>
    `;
  }
  
  cleanupAgGrids() {
    // Destroy existing AG-Grid instances to prevent memory leaks
    if (this.agGridInstances) {
      this.agGridInstances.forEach((grid, cardIndex) => {
        try {
          if (grid && grid.destroy) {
            grid.destroy();
          }
        } catch (error) {
          console.warn('Error destroying AG-Grid instance:', error);
        }
      });
      this.agGridInstances.clear();
    }
  }
  
  renderImageCard(card) {
    return `
      <img src="${card.image}" alt="${card.name}" class="card-image" 
           onerror="this.style.display='none'; this.nextElementSibling.style.paddingTop='40px';" />
      <div class="card-content">
        <h3 class="card-name">${card.name}</h3>
        <p class="card-description">${card.description}</p>
      </div>
    `;
  }
  
  renderTableCard(card, cardIndex) {
    const rowIndex = card.row_index;
    
    // Create AG-Grid container
    let tableHTML = '<div class="table-card-image">';
    tableHTML += `<div class="ag-grid-container" id="ag-grid-${cardIndex}"></div>`;
    tableHTML += '</div>';
    
    // Add card content section like image cards
    tableHTML += '<div class="card-content">';
    tableHTML += `<h3 class="card-name">Row ${rowIndex + 1}</h3>`;
    tableHTML += `<p class="card-description">Swipe to evaluate this data row</p>`;
    tableHTML += '</div>';
    
    // Initialize AG-Grid after rendering
    setTimeout(() => {
      this.initializeAgGrid(cardIndex, rowIndex);
    }, 10);
    
    return tableHTML;
  }
  
  initializeAgGrid(cardIndex, currentRowIndex) {
    const gridContainer = document.getElementById(`ag-grid-${cardIndex}`);
    if (!gridContainer || !this.tableData) return;
    
    // Prepare column definitions
    const columnDefs = this.tableData.columns.map(col => ({
      field: col,
      headerName: col,
      width: 120,
      resizable: true,
      sortable: false,
      filter: false,
      cellStyle: (params) => {
        const rowIndex = params.node.rowIndex;
        const columnField = params.colDef.field;
        
        // Apply cell highlighting first (highest priority)
        const isCellHighlighted = this.isCellHighlighted(rowIndex, columnField, columnField);
        if (isCellHighlighted) {
          const style = this.getHighlightStyleObject(rowIndex, columnField, columnField);
          return style;
        }
        
        // Apply row highlighting
        const isRowHighlighted = this.isRowHighlighted(rowIndex);
        if (isRowHighlighted) {
          const style = this.getRowHighlightStyleObject(rowIndex);
          return style;
        }
        
        // Apply column highlighting
        const isColumnHighlighted = this.isColumnHighlighted(columnField);
        if (isColumnHighlighted) {
          const style = this.getColumnHighlightStyleObject(columnField);
          return style;
        }
        
        // Highlight current row being swiped
        if (rowIndex === currentRowIndex) {
          return {
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            border: '1px solid rgba(0, 123, 255, 0.3)'
          };
        }
        
        return null;
      }
    }));
    
    // Prepare row data
    const rowData = this.tableData.rows.map(row => {
      const rowObj = {};
      this.tableData.columns.forEach((col, index) => {
        rowObj[col] = row[index] || '';
      });
      return rowObj;
    });
    
    // Grid options
    const gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData,
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        resizable: true
      },
      suppressHorizontalScroll: false,
      suppressVerticalScroll: false,
      domLayout: 'normal',
      headerHeight: 35,
      rowHeight: 30,
      animateRows: false,
      suppressMovableColumns: true,
      suppressMenuHide: true,
      suppressContextMenu: true,
      enableCellTextSelection: true,
      rowSelection: 'none',
      onGridReady: (params) => {
        // Auto-size columns to fit
        params.api.sizeColumnsToFit();
        
        // Scroll to current row or centered view
        const rowIndexToCenter = this.centerTableRow !== null ? this.centerTableRow : currentRowIndex;
        const colIdToCenter = this.centerTableColumn;

        if (rowIndexToCenter >= 0) {
          setTimeout(() => {
            params.api.ensureIndexVisible(rowIndexToCenter, 'middle');
          }, 100);
        }
        if (colIdToCenter) {
          setTimeout(() => {
            params.api.ensureColumnVisible(colIdToCenter, 'middle');
          }, 100);
        }
      },
      onFirstDataRendered: (params) => {
        params.api.sizeColumnsToFit();
      }
    };
    
    // Create the grid
    try {
      const grid = agGrid.createGrid(gridContainer, gridOptions);
      
      // Store grid instance for cleanup
      if (!this.agGridInstances) {
        this.agGridInstances = new Map();
      }
      this.agGridInstances.set(cardIndex, grid);
      
    } catch (error) {
      console.error('Error creating AG-Grid:', error);
      // Fallback to simple table if AG-Grid fails
      this.renderFallbackTable(gridContainer, currentRowIndex);
    }
  }
  
  renderFallbackTable(container, currentRowIndex) {
    let tableHTML = '<table class="data-table fallback-table">';
    
    // Header row
    if (this.tableData && this.tableData.columns) {
      tableHTML += '<thead><tr>';
      this.tableData.columns.forEach(col => {
        tableHTML += `<th>${col}</th>`;
      });
      tableHTML += '</tr></thead>';
    }
    
    // Data rows
    tableHTML += '<tbody>';
    if (this.tableData && this.tableData.rows) {
      this.tableData.rows.forEach((row, rIndex) => {
        const isCurrentRow = rIndex === currentRowIndex;
        const rowClass = isCurrentRow ? 'current-row' : '';
        
        tableHTML += `<tr class="${rowClass}">`;
        this.tableData.columns.forEach((col, colIndex) => {
          const cellValue = row[colIndex] || '';
          
          // Check for cell highlighting first (highest priority)
          const isCellHighlighted = this.isCellHighlighted(rIndex, col, colIndex);
          // Check for row highlighting
          const isRowHighlighted = this.isRowHighlighted(rIndex);
          // Check for column highlighting
          const isColumnHighlighted = this.isColumnHighlighted(col);
          
          let style = '';
          if (isCellHighlighted) {
            style = this.getHighlightStyle(rIndex, col, colIndex);
          } else if (isRowHighlighted) {
            const highlight = this.highlightRows.find(h => h.row === rIndex);
            const color = highlight?.color === 'random' ? this.getRandomColor() : (highlight?.color || '#E3F2FD');
            style = `background-color: ${color}; border: 1px solid ${this.darkenColor(color, 20)}; font-weight: 500;`;
          } else if (isColumnHighlighted) {
            const highlight = this.highlightColumns.find(h => h.column === col);
            const color = highlight?.color === 'random' ? this.getRandomColor() : (highlight?.color || '#E8F5E8');
            style = `background-color: ${color}; border: 1px solid ${this.darkenColor(color, 20)}; font-weight: 500;`;
          }
          
          tableHTML += `<td style="${style}">${cellValue}</td>`;
        });
        tableHTML += '</tr>';
      });
    }
    tableHTML += '</tbody>';
    tableHTML += '</table>';
    
    container.innerHTML = tableHTML;
  }
  
  isCellHighlighted(rowIndex, columnName, columnIndex) {
    return this.highlightCells.some(highlight => {
      const matchesRow = highlight.row === rowIndex;
      const matchesColumn = highlight.column === columnName || highlight.column === columnIndex;
      return matchesRow && matchesColumn;
    });
  }
  
  getHighlightStyle(rowIndex, columnName, columnIndex) {
    const highlight = this.highlightCells.find(h => {
      const matchesRow = h.row === rowIndex;
      const matchesColumn = h.column === columnName || h.column === columnIndex;
      return matchesRow && matchesColumn;
    });
    
    if (highlight) {
      let color = highlight.color;
      
      // Handle random color
      if (color === 'random') {
        color = this.getRandomColor();
      }
      
      // Use provided color or default
      color = color || '#FFD700'; // Gold as default
      
      return `background-color: ${color}; border: 2px solid ${this.darkenColor(color, 20)};`;
    }
    return '';
  }
  
  getHighlightStyleObject(rowIndex, columnName, columnIndex) {
    const highlight = this.highlightCells.find(h => {
      const matchesRow = h.row === rowIndex;
      const matchesColumn = h.column === columnName || h.column === columnIndex;
      return matchesRow && matchesColumn;
    });
    
    if (highlight) {
      let color = highlight.color;
      
      // Handle random color
      if (color === 'random') {
        color = this.getRandomColor();
      }
      
      // Use provided color or default
      color = color || '#FFD700'; // Gold as default
      
      return {
        backgroundColor: color,
        border: `2px solid ${this.darkenColor(color, 20)}`,
        fontWeight: 'bold'
      };
    }
    return null;
  }
  
  isRowHighlighted(rowIndex) {
    return this.highlightRows.some(highlight => highlight.row === rowIndex);
  }
  
  isColumnHighlighted(columnName) {
    return this.highlightColumns.some(highlight => {
      return highlight.column === columnName || highlight.column === columnName;
    });
  }
  
  getRowHighlightStyleObject(rowIndex) {
    const highlight = this.highlightRows.find(h => h.row === rowIndex);
    
    if (highlight) {
      let color = highlight.color;
      
      // Handle random color
      if (color === 'random') {
        color = this.getRandomColor();
      }
      
      // Use provided color or default light blue
      color = color || '#E3F2FD'; // Light blue as default for rows
      
      return {
        backgroundColor: color,
        border: `1px solid ${this.darkenColor(color, 20)}`,
        fontWeight: '500'
      };
    }
    return null;
  }
  
  getColumnHighlightStyleObject(columnName) {
    const highlight = this.highlightColumns.find(h => {
      return h.column === columnName || h.column === columnName;
    });
    
    if (highlight) {
      let color = highlight.color;
      
      // Handle random color
      if (color === 'random') {
        color = this.getRandomColor();
      }
      
      // Use provided color or default light green
      color = color || '#E8F5E8'; // Light green as default for columns
      
      return {
        backgroundColor: color,
        border: `1px solid ${this.darkenColor(color, 20)}`,
        fontWeight: '500'
      };
    }
    return null;
  }
  
  getRandomColor() {
    const colors = [
      '#FFB6C1', // Light Pink
      '#98FB98', // Pale Green
      '#87CEEB', // Sky Blue
      '#DDA0DD', // Plum
      '#F0E68C', // Khaki
      '#FFA07A', // Light Salmon
      '#20B2AA', // Light Sea Green
      '#FFE4B5', // Moccasin
      '#D3D3D3', // Light Gray
      '#F5DEB3'  // Wheat
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  darkenColor(color, percent) {
    // Simple color darkening function
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
  
  bindEvents() {
    // Always bind to the first card in the stack (topmost/front card)
    const topCard = this.container.querySelector('.swipe-card:first-child');
    if (!topCard) return;
    
    // Mouse events
    topCard.addEventListener('mousedown', this.handleStart.bind(this));
    document.addEventListener('mousemove', this.handleMove.bind(this));
    document.addEventListener('mouseup', this.handleEnd.bind(this));
    
    // Touch events
    topCard.addEventListener('touchstart', this.handleStart.bind(this));
    document.addEventListener('touchmove', this.handleMove.bind(this));
    document.addEventListener('touchend', this.handleEnd.bind(this));
  }
  
  handleStart(e) {
    this.isDragging = true;
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    
    this.startX = clientX;
    this.startY = clientY;
    this.currentX = clientX;
    this.currentY = clientY;
    
    const topCard = this.container.querySelector('.swipe-card:first-child');
    if (topCard) {
      topCard.classList.add('dragging');
    }
    
    e.preventDefault();
  }
  
  handleMove(e) {
    if (!this.isDragging) return;
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    
    this.currentX = clientX;
    this.currentY = clientY;
    
    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;
    const rotation = deltaX * 0.1;
    
    const topCard = this.container.querySelector('.swipe-card:first-child');
    if (topCard) {
      topCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
      
      // Show action indicators
      const likeIndicator = topCard.querySelector('.action-indicator.like');
      const passIndicator = topCard.querySelector('.action-indicator.pass');
      
      if (deltaX > 50) {
        likeIndicator.classList.add('show');
        passIndicator.classList.remove('show');
      } else if (deltaX < -50) {
        passIndicator.classList.add('show');
        likeIndicator.classList.remove('show');
      } else {
        likeIndicator.classList.remove('show');
        passIndicator.classList.remove('show');
      }
    }
    
    e.preventDefault();
  }
  
  handleEnd(e) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    const deltaX = this.currentX - this.startX;
    const topCard = this.container.querySelector('.swipe-card:first-child');
    
    if (topCard) {
      topCard.classList.remove('dragging');
      
      // Determine swipe direction
      if (Math.abs(deltaX) > 100) {
        if (deltaX > 0) {
          this.swipeRight();
        } else {
          this.swipeLeft();
        }
      } else {
        // Snap back to center
        topCard.style.transform = '';
        topCard.querySelector('.action-indicator.like').classList.remove('show');
        topCard.querySelector('.action-indicator.pass').classList.remove('show');
      }
    }
  }
  
  swipeRight() {
    const topCard = this.container.querySelector('.swipe-card:first-child');
    const card = this.cards[this.currentIndex];
    
    if (topCard && card) {
      topCard.classList.add('swiped-right');
      
      setTimeout(() => {
        this.swipedCards.push({
          card: card,
          action: 'right',
          index: this.currentIndex
        });
        
        // Store the last action but don't send to Streamlit immediately
        this.lastAction = {
          card: card,
          action: 'right',
          cardIndex: this.currentIndex
        };
        
        this.currentIndex++;
        this.render();
        this.bindEvents();
      }, 300);
    }
  }
  
  swipeLeft() {
    const topCard = this.container.querySelector('.swipe-card:first-child');
    const card = this.cards[this.currentIndex];
    
    if (topCard && card) {
      topCard.classList.add('swiped-left');
      
      setTimeout(() => {
        this.swipedCards.push({
          card: card,
          action: 'left',
          index: this.currentIndex
        });
        
        // Store the last action but don't send to Streamlit immediately
        this.lastAction = {
          card: card,
          action: 'left',
          cardIndex: this.currentIndex
        };
        
        this.currentIndex++;
        this.render();
        this.bindEvents();
      }, 300);
    }
  }
  
  goBack() {
    if (this.swipedCards.length === 0) return;
    
    const lastSwiped = this.swipedCards.pop();
    this.currentIndex = lastSwiped.index;
    
    // Store the last action but don't send to Streamlit immediately
    this.lastAction = {
      card: lastSwiped.card,
      action: 'back',
      cardIndex: this.currentIndex
    };
    
    this.render();
    this.bindEvents();
  }
  
  getResults() {
    // Return all swiped cards and the last action
    const results = {
      swipedCards: this.swipedCards,
      lastAction: this.lastAction,
      totalSwiped: this.swipedCards.length,
      remainingCards: this.cards.length - this.currentIndex
    };
    
    // Send results to Streamlit
    sendValue(results);
    return results;
  }
}

let swipeCards = null;

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event) {
  const { 
    cards = [], 
    table_data = null, 
    highlight_cells = [], 
    highlight_rows = [],
    highlight_columns = [],
    display_mode = 'cards',
    centerTableRow = null,
    centerTableColumn = null
  } = event.detail.args;
  
  // Apply theme detection immediately
  detectAndApplyTheme();
  
  // Set up theme monitoring for dynamic updates
  setupThemeMonitoring();
  
  const root = document.getElementById('root');
  root.innerHTML = '<div class="swipe-container"></div>';
  
  const container = root.querySelector('.swipe-container');
  
  // Add table-mode class if needed
  if (display_mode === 'table') {
    container.classList.add('table-mode');
  }
  
  if (cards.length === 0) {
    container.innerHTML = `
      <div class="no-more-cards">
        <h3>📱 No Cards Available</h3>
        <p>Please provide card data to start swiping!</p>
        <div class="results-section">
          <div class="swipe-counter">Ready to swipe when you add cards</div>
        </div>
      </div>
    `;
    return;
  }
  
  // Always create a fresh instance to avoid state persistence issues
  swipeCards = new SwipeCards(container, cards, table_data, highlight_cells, highlight_rows, highlight_columns, display_mode, centerTableRow, centerTableColumn);
  
  // Set the frame height based on content (adjust for table mode)
  const frameHeight = display_mode === 'table' ? 720 : 620;
  Streamlit.setFrameHeight(frameHeight);
}

// Setup theme monitoring for dynamic theme changes
function setupThemeMonitoring() {
  // Monitor system color scheme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addListener(detectAndApplyTheme);
  
  // Monitor parent document changes (for Streamlit theme switching)
  try {
    const parentDoc = window.parent.document;
    const observer = new MutationObserver(() => {
      setTimeout(detectAndApplyTheme, 100); // Small delay to let changes settle
    });
    
    // Watch for class changes on documentElement and body
    observer.observe(parentDoc.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style']
    });
    observer.observe(parentDoc.body, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // Watch for style changes on main app container
    const appContainer = parentDoc.querySelector('.stApp, .main, [data-testid="stAppViewContainer"]');
    if (appContainer) {
      observer.observe(appContainer, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
  } catch (e) {
    console.log('Could not set up theme monitoring:', e);
  }
}

// Render the component whenever python send a "render event"
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
// Tell Streamlit that the component is ready to receive events
Streamlit.setComponentReady()
// Initial frame height (reduced for tighter spacing)
Streamlit.setFrameHeight(620)
