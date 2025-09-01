// The `Streamlit` object exists because our html file includes
// `streamlit-component-lib.js`.
// If you get an error about "Streamlit" not being defined, that
// means you're missing that file.

function sendValue(value) {
  Streamlit.setComponentValue(value)
}

// Hidden progress tracker
const progressEl = (() => {
  let el = document.getElementById('swipe-progress');
  if (!el) {
    el = document.createElement('div');
    el.id = 'swipe-progress';
    el.style.display = 'none';
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.body.contains(el)) {
        document.body.appendChild(el);
      }
    });
  }
  return el;
})();

window.swipeProgress = { loaded: 0, total: 0 };

function updateSwipeProgress() {
  if (progressEl) {
    progressEl.textContent = `${window.swipeProgress.loaded}/${window.swipeProgress.total}`;
  }
}

// Debounced frame height updater
let _resizeRaf = null;
let _resizeTimeout = null;
function updateFrameHeightImmediate() {
  try {
    const docEl = document.documentElement;
    const body = document.body;
    const height = Math.ceil(Math.max(
      docEl?.scrollHeight || 0,
      body?.scrollHeight || 0,
      docEl?.offsetHeight || 0,
      body?.offsetHeight || 0
    ));
    // Ensure a sensible minimum height so controls aren't clipped
    const minH = 360;
    const finalH = Math.max(height, minH);
    Streamlit.setFrameHeight(finalH);
  } catch (e) {
    // Fallback to a safe default if measurement fails
    Streamlit.setFrameHeight(620);
  }
}

function updateFrameHeightDebounced() {
  if (_resizeRaf) cancelAnimationFrame(_resizeRaf);
  if (_resizeTimeout) clearTimeout(_resizeTimeout);
  _resizeRaf = requestAnimationFrame(() => {
    _resizeTimeout = setTimeout(updateFrameHeightImmediate, 50);
  });
}

function handleImageLoad(img) {
  if (img.dataset.full && !img.dataset.fullLoaded) {
    const hiRes = new Image();
    hiRes.src = img.dataset.full;
    hiRes.onload = () => {
      img.dataset.fullLoaded = 'true';
      img.src = img.dataset.full;
    };
  } else {
    img.classList.remove('loading');
    window.swipeProgress.loaded++;
    updateSwipeProgress();
    updateFrameHeightDebounced();
  }
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
      const streamlitSelectors = [
        '.stApp', '.main', '[data-testid="stAppViewContainer"]',
        '.css-1d391kg', '.css-fg4pbf', '[data-testid="stApp"]',
        '.streamlit-container', '.st-emotion-cache-uf99v8'
      ];
      
      let streamlitApp = null;
      for (const selector of streamlitSelectors) {
        streamlitApp = parentDoc.querySelector(selector);
        if (streamlitApp) break;
      }
      
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
        else if (bgColor.includes('14, 17, 23') || bgColor.includes('38, 39, 48') || 
                 bgColor.includes('11, 11, 11') || bgColor.includes('0, 0, 0')) {
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

    // Copy Streamlit theme colors into component variables
    const parentStyle = window.parent.getComputedStyle(parentDoc.documentElement);
    const docStyle = document.documentElement.style;
    
    // Get colors from parent
    const primary = parentStyle.getPropertyValue('--primary-color');
    const bg = parentStyle.getPropertyValue('--background-color');
    const secondaryBg = parentStyle.getPropertyValue('--secondary-background-color');
    const text = parentStyle.getPropertyValue('--text-color');

    if (primary) docStyle.setProperty('--primary-color', primary.trim());
    if (bg) {
      docStyle.setProperty('--background-color', bg.trim());
      docStyle.setProperty('--bg-color', bg.trim());
    }
    if (secondaryBg) {
      docStyle.setProperty('--secondary-background-color', secondaryBg.trim());
      docStyle.setProperty('--card-bg', secondaryBg.trim());
    }
    if (text) {
      docStyle.setProperty('--text-color', text.trim());
      docStyle.setProperty('--text-primary', text.trim());
    }

    // Persist theme snapshot for JS usage
    window._swipecardsTheme = {
      primary: (primary || '').trim(),
      background: (bg || '').trim(),
      secondaryBackground: (secondaryBg || '').trim(),
      text: (text || '').trim(),
    };
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

// Apply Streamlit-provided theme (if available via event.detail.theme)
function applyStreamlitTheme(theme) {
  if (!theme) return;
  try {
    const root = document.documentElement.style;
    if (theme.primaryColor) root.setProperty('--primary-color', theme.primaryColor);
    if (theme.backgroundColor) {
      root.setProperty('--background-color', theme.backgroundColor);
      root.setProperty('--bg-color', theme.backgroundColor);
    }
    if (theme.secondaryBackgroundColor) {
      root.setProperty('--secondary-background-color', theme.secondaryBackgroundColor);
      root.setProperty('--card-bg', theme.secondaryBackgroundColor);
    }
    if (theme.textColor) {
      root.setProperty('--text-color', theme.textColor);
      root.setProperty('--text-primary', theme.textColor);
    }
    if (theme.font) {
      root.setProperty('--font', theme.font);
    }
    // Base can be 'light' or 'dark'
    if (theme.base) {
      document.documentElement.setAttribute('data-theme', theme.base.toLowerCase() === 'dark' ? 'dark' : 'light');
      document.body.className = theme.base.toLowerCase() === 'dark' ? 'dark-theme' : 'light-theme';
    }
    window._swipecardsTheme = {
      primary: theme.primaryColor || '',
      background: theme.backgroundColor || '',
      secondaryBackground: theme.secondaryBackgroundColor || '',
      text: theme.textColor || '',
    };
  } catch (e) {
    console.log('Could not apply Streamlit theme directly:', e);
  }
}

// Color helpers
function hexToRgb(hex) {
  if (!hex) return null;
  const h = hex.trim();
  const m = h.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}
function toRgbaString(rgb, a = 1) {
  if (!rgb) return `rgba(0,0,0,${a})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lightenRgb(rgb, pct) {
  const f = pct / 100;
  return {
    r: clamp(Math.round(rgb.r + (255 - rgb.r) * f), 0, 255),
    g: clamp(Math.round(rgb.g + (255 - rgb.g) * f), 0, 255),
    b: clamp(Math.round(rgb.b + (255 - rgb.b) * f), 0, 255),
  };
}
function darkenRgb(rgb, pct) {
  const f = pct / 100;
  return {
    r: clamp(Math.round(rgb.r * (1 - f)), 0, 255),
    g: clamp(Math.round(rgb.g * (1 - f)), 0, 255),
    b: clamp(Math.round(rgb.b * (1 - f)), 0, 255),
  };
}
function bestTextOn(rgb) {
  if (!rgb) return '#fff';
  // Luma formula
  const luma = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
  return luma > 186 ? '#000' : '#fff';
}

class SwipeCards {
  constructor(container, cards, tableData = null, highlightCells = [], highlightRows = [], highlightColumns = [], displayMode = 'cards', centerTableRow = null, centerTableColumn = null, lastCardMessage = 'No more cards to swipe', opts = {}) {
    this.container = container;
    this.cards = cards;
    this.tableData = tableData;
    this.highlightCells = highlightCells;
    this.highlightRows = highlightRows;
    this.highlightColumns = highlightColumns;
    this.displayMode = displayMode;
    this.centerTableRow = centerTableRow;
    this.centerTableColumn = centerTableColumn;
    this.lastCardMessage = lastCardMessage;
    // Options
    this.tableFontSize = opts.tableFontSize ?? 14;
    this.tableMaxRows = opts.tableMaxRows ?? null;
    this.tableMaxColumns = opts.tableMaxColumns ?? null;
    // Theme flags removed: always follow Streamlit theme when available
    this.currentIndex = 0;
    this.swipedCards = [];
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.lastAction = null; // Store the last action without sending immediately
    this.agGridInstances = new Map(); // Store AG-Grid instances for cleanup
    this.gridHandlers = new Map(); // Store table interaction handlers
    this.isAnimating = false; // Prevent rapid repeated actions
    this.mode = 'swipe'; // Default mode
    this.moveRaf = null; // Track scheduled move frame
    this.isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    this.pillsModalOpen = false; // Track pills modal state
    this.maxVisiblePills = 3; // Max pills shown inline before collapsing

    // Bind swipe handlers once so we can add/remove them easily
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);

    this.init();
  }

  init() {
    // Apply theme detection
    detectAndApplyTheme();
    this.render();
    this.bindEvents();

    // Delegate interactions for mode toggle and center actions
    if (!this._delegatedToggle) {
      this.container.addEventListener(
        'click',
        (e) => {
          const toggleBtn =
            e.target && e.target.closest && e.target.closest('.mode-toggle-btn');
          if (toggleBtn && this.container.contains(toggleBtn)) {
            e.preventDefault();
            e.stopPropagation();
            const newMode = this.mode === 'swipe' ? 'inspect' : 'swipe';
            this.setMode(newMode);
            return;
          }

          // Show-more pills button (backward-compatible with previous class)
          const showAllBtn = e.target && e.target.closest && (e.target.closest('.pills-show-more-btn') || e.target.closest('.pills-show-all-btn'));
          if (showAllBtn && this.container.contains(showAllBtn)) {
            e.preventDefault();
            e.stopPropagation();
            const cardEl = showAllBtn.closest('.swipe-card');
            const cardIndex = cardEl ? parseInt(cardEl.getAttribute('data-index')) : this.currentIndex;
            this.openPillsModal(cardIndex);
            return;
          }

          // Close modal via header close button or overlay click
          const closeBtn = e.target && e.target.closest && e.target.closest('.pills-modal-close');
          if (closeBtn) {
            e.preventDefault();
            e.stopPropagation();
            this.closePillsModal();
            return;
          }

          const overlay = e.target && e.target.classList && e.target.classList.contains('pills-modal-overlay');
          if (overlay) {
            e.preventDefault();
            e.stopPropagation();
            this.closePillsModal();
            return;
          }
        },
        true,
      ); // capture to win against other listeners

      this._delegatedToggle = true;
    }
  }

  // Display a temporary notification inside the component
  showNotification(message) {
    const existing = this.container.querySelector('.swipe-notification');
    if (existing) {
      existing.remove();
    }
    const note = document.createElement('div');
    note.className = 'swipe-notification';
    note.textContent = message;
    this.container.appendChild(note);
    // Trigger CSS transition
    requestAnimationFrame(() => note.classList.add('visible'));
    setTimeout(() => {
      note.classList.remove('visible');
      setTimeout(() => note.remove(), 300);
    }, 2000);
  }
  
  render() {
    console.log('Rendering cards. CurrentIndex:', this.currentIndex, 'Total cards:', this.cards.length, 'Display mode:', this.displayMode);
    
    // Clean up existing AG-Grid instances
    this.cleanupAgGrids();

    if (this.currentIndex >= this.cards.length) {
      this.container.innerHTML = `
        <div class="cards-stack">
          <div class="swipe-card no-more-cards">
            <h3>🎉 All done!</h3>
            <p>${this.lastCardMessage}</p>
          </div>
        </div>
        <div class="action-buttons">
          <button class="action-btn btn-pass" onclick="swipeCards.swipeLeft()" disabled>❌</button>
          <button class="action-btn btn-back" onclick="swipeCards.goBack()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C8.5 21 5.5 18.5 4 15.5" stroke="#FFA500" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M2 14L4 12.5L6 14" stroke="#FFA500" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
          </button>
          <button class="action-btn btn-like" onclick="swipeCards.swipeRight()" disabled>✔️</button>
        </div>
        <div class="results-section">
          <div class="swipe-counter">Total swiped: ${this.swipedCards.length}</div>
        </div>
      `;
      return;
    }
    
    let cardsHTML = '';

    // Show up to 5 cards in the stack for smoother animations
    for (let i = 0; i < Math.min(5, this.cards.length - this.currentIndex); i++) {
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
          <div class="action-indicator like">✔️</div>
          <div class="action-indicator pass">❌</div>
        </div>
      `;
    }
    
    this.container.classList.toggle('inspect-mode', this.mode === 'inspect');
    this.container.classList.toggle('swipe-mode', this.mode === 'swipe');

    this.container.innerHTML = `
      <div class="cards-stack">
        ${cardsHTML}
      </div>
      <div class="action-buttons">
        <button class="action-btn btn-pass" onclick="swipeCards.swipeLeft()">❌</button>
        <button class="action-btn btn-back" onclick="swipeCards.goBack()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C8.5 21 5.5 18.5 4 15.5" stroke="#FFA500" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <path d="M2 16L4 13L6 16" stroke="#FFA500" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </button>
        <button class="action-btn btn-like" onclick="swipeCards.swipeRight()">✔️</button>
      </div>
      <div class="results-section">
        <div class="swipe-counter">Swiped: ${this.swipedCards.length} | Remaining: ${this.cards.length - this.currentIndex}</div>
      </div>
    `;

    // Bind toggle button (only if delegation not set up)
    if (!this._delegatedToggle) {
      const toggleBtns = this.container.querySelectorAll('.mode-toggle-btn');
      toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const newMode = this.mode === 'swipe' ? 'inspect' : 'swipe';
          this.setMode(newMode);
        });
      });
    }

    // Ensure the Streamlit iframe height tracks content
    updateFrameHeightDebounced();
  }

  setMode(mode) {
    this.mode = mode;
    if (mode !== 'swipe') {
      this.isDragging = false;
    }
    this.container.classList.toggle('inspect-mode', mode === 'inspect');
    this.container.classList.toggle('swipe-mode', mode === 'swipe');
    const actionBtns = this.container.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
      // Keep buttons clickable for notifications, but dim them in inspect mode
      btn.disabled = false;
    });
    const toggleBtns = this.container.querySelectorAll('.mode-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.textContent = mode === 'swipe' ? 'Inspect' : 'Swipe';
    });

    this.updateGridListeners();
    this.bindEvents();

    // When entering inspect mode, expand any highlighted cell's column
    // on the front (active) card so its content isn't clipped.
    if (mode === 'inspect') {
      try {
        const front = this.container.querySelector('.swipe-card.card-front');
        if (front) {
          const cardIndex = parseInt(front.getAttribute('data-index'));
          const card = this.cards[cardIndex];
          if (card && (card.highlight_cells?.length || this.highlightCells.length)) {
            const rowIndexToCenter =
              card.center_table_row !== null && card.center_table_row !== undefined
                ? card.center_table_row
                : (this.centerTableRow !== null && this.centerTableRow !== undefined
                    ? this.centerTableRow
                    : card.row_index);
            this.autosizeHighlightedColumnsForCard(cardIndex, rowIndexToCenter);
          }
        }
      } catch (_) {
        // Non-fatal if autosize on toggle fails
      }
    }
    updateFrameHeightDebounced();
  }

  updateGridListeners() {
    const pdOpts = { capture: true };
    const puOpts = { passive: false, capture: true };
    const blockOpts = { passive: false, capture: true };

    this.gridHandlers.forEach((handlers, gridContainer) => {
      gridContainer.removeEventListener('pointerdown', handlers.handlePointerDown, pdOpts);
      gridContainer.removeEventListener('pointerup', handlers.handlePointerUp, puOpts);
      gridContainer.removeEventListener('wheel', handlers.blockScroll, blockOpts);
      gridContainer.removeEventListener('touchmove', handlers.blockScroll, blockOpts);
      gridContainer.removeEventListener('keydown', handlers.handleKeyDown, true);
      gridContainer.removeEventListener('wheel', handlers.handleWheel, false);
      if (handlers.blockResizeHandle) {
        gridContainer.removeEventListener('mousedown', handlers.blockResizeHandle, true);
        gridContainer.removeEventListener('dblclick', handlers.blockResizeHandle, true);
      }
      gridContainer.removeEventListener('pointerdown', handlers.handlePanStart, { passive: false });
      gridContainer.removeEventListener('pointermove', handlers.handlePanMove, { passive: false });
      window.removeEventListener('pointerup', handlers.handlePanEnd, { passive: true });
      gridContainer.removeEventListener('touchstart', handlers.handlePanStart, { passive: false });
      gridContainer.removeEventListener('touchmove', handlers.handlePanMove, { passive: false });
      window.removeEventListener('touchend', handlers.handlePanEnd, { passive: true });

      if (this.mode === 'swipe') {
        gridContainer.addEventListener('pointerdown', handlers.handlePointerDown, pdOpts);
        gridContainer.addEventListener('pointerup', handlers.handlePointerUp, puOpts);
        gridContainer.addEventListener('wheel', handlers.blockScroll, blockOpts);
        gridContainer.addEventListener('touchmove', handlers.blockScroll, blockOpts);
        gridContainer.addEventListener('keydown', handlers.handleKeyDown, true);
        if (handlers.blockResizeHandle) {
          gridContainer.addEventListener('mousedown', handlers.blockResizeHandle, true);
          gridContainer.addEventListener('dblclick', handlers.blockResizeHandle, true);
        }
      } else {
        // Enable panning and wheel scrolling in inspect mode
        gridContainer.addEventListener('pointerdown', handlers.handlePanStart, { passive: false });
        gridContainer.addEventListener('pointermove', handlers.handlePanMove, { passive: false });
        window.addEventListener('pointerup', handlers.handlePanEnd, { passive: true });
        gridContainer.addEventListener('touchstart', handlers.handlePanStart, { passive: false });
        gridContainer.addEventListener('touchmove', handlers.handlePanMove, { passive: false });
        window.addEventListener('touchend', handlers.handlePanEnd, { passive: true });
        gridContainer.addEventListener('wheel', handlers.handleWheel, { passive: false });
      }
    });
  }
  
  cleanupAgGrids() {
    // Destroy existing AG-Grid instances to prevent memory leaks
    if (this.agGridInstances) {
      this.agGridInstances.forEach((grid) => {
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

    if (this.gridHandlers) {
      const pdOpts = { capture: true };
      const puOpts = { passive: false, capture: true };
      const blockOpts = { passive: false, capture: true };

      this.gridHandlers.forEach((handlers, gridContainer) => {
        gridContainer.removeEventListener('pointerdown', handlers.handlePointerDown, pdOpts);
        gridContainer.removeEventListener('pointerup', handlers.handlePointerUp, puOpts);
        gridContainer.removeEventListener('wheel', handlers.blockScroll, blockOpts);
        gridContainer.removeEventListener('touchmove', handlers.blockScroll, blockOpts);
        gridContainer.removeEventListener('keydown', handlers.handleKeyDown, true);
        gridContainer.removeEventListener('wheel', handlers.handleWheel, false);
        if (handlers.blockResizeHandle) {
          gridContainer.removeEventListener('mousedown', handlers.blockResizeHandle, true);
          gridContainer.removeEventListener('dblclick', handlers.blockResizeHandle, true);
        }
      });
      this.gridHandlers.clear();
    }
  }
  
  renderImageCard(card) {
    let pillsHTML = '';
    if (card.pills && Array.isArray(card.pills) && card.pills.length > 0) {
      pillsHTML = this.renderPills(card.pills);
    }

    const lowRes = card.lowres || card.lowRes || card.image_low || card.thumbnail;
    const placeholder = card.placeholder || card.placeholder_image;

    const src = placeholder || card.image;
    const srcsetAttr = lowRes ? `srcset="${lowRes} 480w, ${card.image} 800w"` : '';
    const placeholderAttrs = placeholder ? `data-full="${card.image}"` : '';

    return `
      <img src="${src}" ${srcsetAttr} ${placeholderAttrs} alt="${card.name}" class="card-image loading" loading="lazy" onload="handleImageLoad(this)"
           onerror="this.style.display='none'; this.nextElementSibling.style.paddingTop='40px';" />
      <div class="card-content">
        <h3 class="card-name">${card.name}</h3>
        <p class="card-description">${card.description}</p>
        ${pillsHTML}
      </div>
    `;
  }
  
  renderTableCard(card, cardIndex) {
    const rowIndex = card.row_index;
    
    // Create AG-Grid container, initially hidden
    let tableHTML = '<div class="table-card-image">';
    tableHTML += '<div class="loading-overlay">';
    tableHTML += '<div class="loading-snake"></div>';
    tableHTML += '<button class="loading-btn">Loading data...</button>';
    tableHTML += '</div>';
    tableHTML += `<div class="ag-grid-container loading" id="ag-grid-${cardIndex}" style="visibility: hidden;"></div>`;
    tableHTML += '</div>';
    
    // Add pills if they exist
    let pillsHTML = '';
    if (card.pills && Array.isArray(card.pills) && card.pills.length > 0) {
      pillsHTML = this.renderPills(card.pills);
    }
    
    // Add card content section like image cards
    const modeLabel = this.mode === 'swipe' ? 'Inspect' : 'Swipe';
    tableHTML += '<div class="card-content">';
    tableHTML += '<div class="card-header">';
    tableHTML += `<h3 class="card-name">${card.name || `Row ${rowIndex + 1}`}</h3>`;
    tableHTML += '<div class="card-header-buttons">';
    tableHTML += `<button class="mode-toggle-btn">${modeLabel}</button>`;
    tableHTML += '</div>';
    tableHTML += '</div>';
    tableHTML += `<p class="card-description">${card.description || `Swipe to evaluate this data row`}</p>`;
    tableHTML += pillsHTML;
    tableHTML += '</div>';
    
    // Initialize AG-Grid after rendering - pre-center all cards, not just visible ones
    setTimeout(() => {
      this.initializeAgGrid(cardIndex, rowIndex);
    }, 10);
    
    return tableHTML;
  }
  
  initializeAgGrid(cardIndex, currentRowIndex) {
    const gridContainer = document.getElementById(`ag-grid-${cardIndex}`);
    if (!gridContainer) return;

    // Get the table data for this specific card using the correct card index
    const card = this.cards[cardIndex];
    const tableData = card.table_data || this.tableData;

    if (!tableData) return;

    const shouldBlockResize = this.isTouchDevice && this.displayMode !== 'table';

    // Warn users in swipe mode that they need to inspect to interact with the table
    let tapStartTime = 0;
    let tapStartX = 0;
    let tapStartY = 0;

    const handlePointerDown = (e) => {
      if (this.mode === 'swipe') {
        tapStartTime = Date.now();
        tapStartX = e.clientX;
        tapStartY = e.clientY;
      }
    };

    const handlePointerUp = (e) => {
      if (this.mode === 'swipe') {
        const dt = Date.now() - tapStartTime;
        const dx = Math.abs(e.clientX - tapStartX);
        const dy = Math.abs(e.clientY - tapStartY);
        if (dt < 200 && dx < 10 && dy < 10) {
          e.preventDefault();
          this.showNotification('Click "Inspect" to inspect the table');
        }
      }
    };

    const blockScroll = (e) => {
      if (this.mode === 'swipe') {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e) => {
      if (this.mode === 'swipe') {
        const blockKeys = [
          'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
          'PageUp', 'PageDown', 'Home', 'End', ' '
        ];
        if (blockKeys.includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleWheel = (e) => {
      if (this.mode !== 'inspect') return;
      // Use AG Grid's dedicated viewports: vertical = ag-body-viewport, horizontal = ag-center-cols-viewport
      const vEl = gridContainer.querySelector('.ag-body-viewport');
      const hEl = gridContainer.querySelector('.ag-center-cols-viewport') || vEl;
      const dy = e.deltaY || 0;
      const dxRaw = e.deltaX || 0;
      // Allow shift+wheel to scroll horizontally when deltaX is 0
      const dx = dxRaw !== 0 ? dxRaw : (e.shiftKey ? dy : 0);
      let handled = false;
      if (vEl && dy !== 0) {
        vEl.scrollTop += dy;
        handled = true;
      }
      if (hEl && dx !== 0) {
        hEl.scrollLeft += dx;
        handled = true;
      }
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Block column resizing interactions when not in inspect mode
    let blockResizeHandle = null;
    if (shouldBlockResize) {
      blockResizeHandle = (e) => {
        if (this.mode === 'swipe') {
          const isResizeHandle =
            e.target &&
            e.target.closest &&
            (e.target.closest('.ag-header-cell-resize') ||
              e.target.closest('.ag-resizer'));
          if (isResizeHandle) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      };
    }

    // Panning support in inspect mode (desktop drag and mobile touch)
    const panState = { active: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 };
    const panViewports = () => ({
      vEl: gridContainer.querySelector('.ag-body-viewport'),
      hEl: gridContainer.querySelector('.ag-center-cols-viewport') || gridContainer.querySelector('.ag-body-viewport')
    });
    const panShouldStart = (target) => {
      // Don't pan when starting on header or on a resize handle
      if (!target || !target.closest) return true;
      // Block panning entirely if the gesture starts in the header area
      if (target.closest('.ag-header')) return false;
      // Also block when starting on explicit resize handles
      if (target.closest('.ag-header-cell-resize') || target.closest('.ag-resizer')) return false;
      return true;
    };
    const handlePanStart = (e) => {
      if (this.mode !== 'inspect') return;
      // Allow mouse panning, but not if starting in header or on resize handle
      if (!panShouldStart(e.target)) return;
      const { vEl, hEl } = panViewports();
      if (!vEl && !hEl) return;
      panState.active = true;
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      panState.startX = clientX;
      panState.startY = clientY;
      panState.startLeft = (hEl ? hEl.scrollLeft : 0);
      panState.startTop = (vEl ? vEl.scrollTop : 0);
      gridContainer.classList.add('panning');
      e.preventDefault();
    };
    const handlePanMove = (e) => {
      if (!panState.active || this.mode !== 'inspect') return;
      const { vEl, hEl } = panViewports();
      if (!vEl && !hEl) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      const dx = clientX - panState.startX;
      const dy = clientY - panState.startY;
      if (hEl) hEl.scrollLeft = panState.startLeft - dx;
      if (vEl) vEl.scrollTop = panState.startTop - dy;
      e.preventDefault();
    };
    const handlePanEnd = (e) => {
      if (!panState.active) return;
      panState.active = false;
      gridContainer.classList.remove('panning');
      // Don't prevent default here to allow clicks to pass if it was a tap
    };

    // Store handlers for later enabling/disabling
    this.gridHandlers.set(gridContainer, {
      handlePointerDown,
      handlePointerUp,
      blockScroll,
      handleKeyDown,
      handleWheel,
      blockResizeHandle,
      handlePanStart,
      handlePanMove,
      handlePanEnd,
    });

    if (this.mode === 'swipe') {
      gridContainer.addEventListener('pointerdown', handlePointerDown, { capture: true });
      gridContainer.addEventListener('pointerup', handlePointerUp, { passive: false, capture: true });
      gridContainer.addEventListener('wheel', blockScroll, { passive: false, capture: true });
      gridContainer.addEventListener('touchmove', blockScroll, { passive: false, capture: true });
      gridContainer.addEventListener('keydown', handleKeyDown, true);
      // Prevent header resize drag and double-click autosize in swipe mode
      if (blockResizeHandle) {
        gridContainer.addEventListener('mousedown', blockResizeHandle, true);
        gridContainer.addEventListener('dblclick', blockResizeHandle, true);
      }
    } else {
      // In inspect mode, enable drag panning for desktop and touch + wheel scrolling
      gridContainer.addEventListener('pointerdown', handlePanStart, { passive: false });
      gridContainer.addEventListener('pointermove', handlePanMove, { passive: false });
      window.addEventListener('pointerup', handlePanEnd, { passive: true });
      // For older mobile browsers that fire touch events
      gridContainer.addEventListener('touchstart', handlePanStart, { passive: false });
      gridContainer.addEventListener('touchmove', handlePanMove, { passive: false });
      window.addEventListener('touchend', handlePanEnd, { passive: true });
      // Desktop wheel and trackpad support (both axes)
      gridContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    // Use card-specific highlight configurations
    const highlightCells = card.highlight_cells || this.highlightCells;
    const highlightRows = card.highlight_rows || this.highlightRows;
    const highlightColumns = card.highlight_columns || this.highlightColumns;
    
    // Apply max columns/rows (visual trim)
    const effectiveColumns = Array.isArray(tableData.columns)
      ? tableData.columns.slice(0, this.tableMaxColumns || tableData.columns.length)
      : [];
    const effectiveRows = Array.isArray(tableData.rows)
      ? tableData.rows.slice(0, this.tableMaxRows || tableData.rows.length)
      : [];

    // Build a quick lookup for highlighted column ids (respecting numeric indices under trimming)
    const highlightedColIds = new Set(
      (highlightCells || [])
        .map(h => (typeof h?.column === 'number' ? effectiveColumns[h.column] : h?.column))
        .filter(Boolean)
    );

    // Prepare column definitions
    const isInspect = this.mode === 'inspect';
    const columnDefs = effectiveColumns.map(col => {
      const isHighlightedCol = highlightedColIds.has(col);
      return {
        field: col,
        headerName: col,
        // In inspect mode, avoid flex sizing so columns can exceed the viewport
        // and enable horizontal scrolling; in swipe mode, keep flex for tidy fit.
        // Also avoid flex on highlighted columns so width autosizing isn't overridden.
        ...((isInspect || isHighlightedCol) ? {} : { flex: 1 }),
        minWidth: 60,
        // Prevent sizeColumnsToFit() from shrinking highlighted columns
        suppressSizeToFit: isInspect || isHighlightedCol,
        resizable: true,
        sortable: false,
        filter: false,
        // Let highlighted columns wrap if they still exceed viewport width
        ...(isHighlightedCol ? { wrapText: true, autoHeight: true } : {}),
        cellStyle: (params) => {
          const rowIndex = params.node.rowIndex;
          const columnField = params.colDef.field;

          // Apply cell highlighting first (highest priority)
          const isCellHighlighted = this.isCellHighlightedForCard(rowIndex, columnField, columnField, highlightCells);
          if (isCellHighlighted) {
            const style = this.getHighlightStyleObjectForCard(rowIndex, columnField, columnField, highlightCells);
            return style;
          }

          // Apply row highlighting
          const isRowHighlighted = this.isRowHighlightedForCard(rowIndex, highlightRows);
          if (isRowHighlighted) {
            const style = this.getRowHighlightStyleObjectForCard(rowIndex, highlightRows);
            return style;
          }

          // Apply column highlighting
          const isColumnHighlighted = this.isColumnHighlightedForCard(columnField, highlightColumns);
          if (isColumnHighlighted) {
            const style = this.getColumnHighlightStyleObjectForCard(columnField, highlightColumns);
            return style;
          }

          return null;
        }
      };
    });
    
    // Prepare row data
    const rowData = effectiveRows.map(row => {
      const rowObj = {};
      effectiveColumns.forEach((col, index) => {
        rowObj[col] = row[index] || '';
      });
      return rowObj;
    });

    // Data source for infinite row model
    const dataSource = {
      rowCount: rowData.length,
      getRows: (params) => {
        const start = params.startRow ?? params.request?.startRow ?? 0;
        const end = params.endRow ?? params.request?.endRow ?? 0;
        const rowsThisPage = rowData.slice(start, end);
        params.successCallback(rowsThisPage, rowData.length);
      }
    };

    // Grid options
    const rowHeight = Math.max(24, Math.round((this.tableFontSize || 14) + 12));
    const headerHeight = Math.max(28, Math.round((this.tableFontSize || 14) + 14));
    const gridOptions = {
      columnDefs: columnDefs,
      defaultColDef: {
        resizable: true
      },
      rowModelType: 'infinite',
      cacheBlockSize: 100,
      maxBlocksInCache: 10,
      suppressHorizontalScroll: false,
      suppressVerticalScroll: false,
      domLayout: 'normal',
      headerHeight: headerHeight,
      rowHeight: rowHeight,
      animateRows: false,
      suppressMovableColumns: true,
      suppressMenuHide: true,
      suppressColumnVirtualisation: false,
      suppressRowVirtualisation: false,
      suppressContextMenu: true,
      enableCellTextSelection: true,
      rowSelection: 'none',
      onGridReady: (params) => {
        params.api.setDatasource(dataSource);
      },
      onFirstDataRendered: (params) => {
        // 1) Auto-size columns to their content (including header)
        const allColIds = [];
        const cols = params.columnApi.getColumns() || [];
        cols.forEach(c => allColIds.push(c.getColId()));
        if (allColIds.length > 0) {
          params.columnApi.autoSizeColumns(allColIds, false);
        }
        // 1b) Ensure highlighted columns are fully auto-sized immediately in all modes
        try {
          const cardHighlights = (card.highlight_cells || this.highlightCells || []).filter(h => h);
          if (cardHighlights.length > 0) {
            const colIds = Array.from(new Set(cardHighlights.map(h => {
              if (typeof h.column === 'number') {
                return effectiveColumns[h.column];
              }
              return h.column;
            }).filter(Boolean)));
            if (colIds.length > 0) {
              colIds.forEach(id => params.api.ensureColumnVisible(id, 'middle'));
              // Delay slightly so target row paints before measuring
              setTimeout(() => {
                try { params.columnApi.autoSizeColumns(colIds, false); } catch (_) {}
              }, 50);
            }
          }
        } catch (_) {}
        // 2) If the widget is wider than the total of the autosized columns,
        //    expand columns to utilize available width (keep as-is otherwise).
        if (this.mode !== 'inspect') {
          try {
            const gridWidth = gridContainer.getBoundingClientRect().width || gridContainer.clientWidth || 0;
            const displayed = params.columnApi.getAllDisplayedColumns() || [];
            const totalColumnsWidth = displayed.reduce((sum, col) => sum + (col.getActualWidth ? col.getActualWidth() : 0), 0);
            if (gridWidth > 0 && totalColumnsWidth > 0 && gridWidth > totalColumnsWidth) {
              // Make columns grow to (approximately) the widget width in swipe mode only
              params.api.sizeColumnsToFit();
            }
          } catch (e) {
            // Non-fatal: fallback is to keep autosized widths
          }
        }
        // Do not cap widths; allow full resize in Inspect mode
        
        // Scroll to current row or centered view
        const rowIndexToCenter = card.center_table_row !== null ? card.center_table_row : (this.centerTableRow !== null ? this.centerTableRow : currentRowIndex);
        const colIdToCenter = card.center_table_column ?? this.centerTableColumn;

        console.log(`Centering card ${cardIndex}: row=${rowIndexToCenter}, col=${colIdToCenter}`);

        // Force the grid to be fully visible for centering
        gridContainer.style.visibility = 'visible';
        gridContainer.style.zIndex = '9999';

        const overlay = gridContainer.parentElement.querySelector('.loading-overlay');
        if (overlay) {
          overlay.classList.add('fade-out');
          setTimeout(() => overlay.remove(), 300);
        }

        gridContainer.classList.remove('loading');
        window.swipeProgress.loaded++;
        updateSwipeProgress();

        if (rowIndexToCenter >= 0) {
          params.api.ensureIndexVisible(rowIndexToCenter, 'middle');
        }
        if (colIdToCenter !== undefined && colIdToCenter !== null && colIdToCenter !== '') {
          params.api.ensureColumnVisible(colIdToCenter, 'middle');
        }

        // (Kept) Highlight autosize handled above for both modes

        // After centering, adjust visibility based on card position
        setTimeout(() => {
          if (cardIndex <= this.currentIndex + 2) {
            // Keep visible for first 3 cards
            gridContainer.style.visibility = 'visible';
            gridContainer.style.opacity = '1';
            gridContainer.style.zIndex = '';
          } else {
            // Hide background cards but keep them rendered
            gridContainer.style.visibility = 'hidden';
            gridContainer.style.opacity = '0';
            gridContainer.style.zIndex = '-1';
          }
          
          // Always store grid reference
          this.agGridInstances.set(`${cardIndex}_centered`, true);
        }, 200); // Longer delay to ensure centering is complete

        // Update frame height after data renders and centering completes
        updateFrameHeightDebounced();
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
      gridContainer.classList.remove('loading');
      const overlay = gridContainer.parentElement.querySelector('.loading-overlay');
      if (overlay) overlay.remove();
      window.swipeProgress.loaded++;
      updateSwipeProgress();
    }
  }

  // Expand the highlighted cell's column(s) for a given card so the
  // highlighted content is fully visible. Safe to call anytime after
  // the grid has been created for that card.
  autosizeHighlightedColumnsForCard(cardIndex, rowIndex) {
    try {
      const grid = this.agGridInstances?.get(cardIndex);
      if (!grid) return;
      const card = this.cards?.[cardIndex];
      if (!card) return;
      const tableData = card.table_data || this.tableData;
      if (!tableData) return;

      // Respect visual trimming settings to map numeric indices correctly
      const effectiveColumns = Array.isArray(tableData.columns)
        ? tableData.columns.slice(0, this.tableMaxColumns || tableData.columns.length)
        : [];

      const highlights = (card.highlight_cells || this.highlightCells || []).filter(h => h);
      if (highlights.length === 0) return;

      const colIds = Array.from(new Set(highlights.map(h => {
        if (typeof h.column === 'number') {
          return effectiveColumns[h.column];
        }
        return h.column;
      }).filter(Boolean)));
      if (colIds.length === 0) return;

      // Center the row/columns, then autosize after a short delay to ensure
      // DOM rendering has caught up.
      try { grid.ensureIndexVisible?.(rowIndex, 'middle'); } catch (_) {}
      colIds.forEach(id => { try { grid.ensureColumnVisible?.(id, 'middle'); } catch (_) {} });

      const columnApi = grid.getColumnApi ? grid.getColumnApi() : null;
      if (!columnApi) return;

      setTimeout(() => {
        try {
          columnApi.autoSizeColumns(colIds, false);
        } catch (_) {}
      }, 60);
    } catch (_) {
      // Silently ignore; autosize is a non-critical enhancement
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
        tableHTML += '<tr>';
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
            let color = highlight?.color;
            if (color === 'random') color = this.getRandomColor();
            if (!color && window._swipecardsTheme?.primary) {
              const rgb = hexToRgb(window._swipecardsTheme.primary);
              const bg = toRgbaString(rgb, 0.12);
              style = `background-color: ${bg}; border: 1px solid #111111; font-weight: 500;`;
            } else {
              color = color || '#E3F2FD';
              style = `background-color: ${color}; border: 1px solid #111111; font-weight: 500;`;
            }
          } else if (isColumnHighlighted) {
            const highlight = this.highlightColumns.find(h => h.column === col);
            let color = highlight?.color;
            if (color === 'random') color = this.getRandomColor();
            if (!color && window._swipecardsTheme?.primary) {
              const rgb = hexToRgb(window._swipecardsTheme.primary);
              const bg = toRgbaString(rgb, 0.12);
              style = `background-color: ${bg}; border: 1px solid #111111; font-weight: 500;`;
            } else {
              color = color || '#E8F5E8';
              style = `background-color: ${color}; border: 1px solid #111111; font-weight: 500;`;
            }
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
      if (color === 'random') color = this.getRandomColor();
      if (!color && window._swipecardsTheme?.primary) {
        const rgb = hexToRgb(window._swipecardsTheme.primary);
        const bg = toRgbaString(rgb, 0.18);
        const bd = toRgbaString(darkenRgb(rgb, 20), 0.9);
        return `background-color: ${bg}; border: 2px solid ${bd};`;
      }
      color = color || '#FFD700';
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
      color = color || '#FFD700'; // Gold as default when theme color is not used
      
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
        border: `1px solid #111111`,
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
        border: `1px solid #111111`,
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
  
  // Card-specific highlighting methods
  isCellHighlightedForCard(rowIndex, columnName, columnIndex, highlightCells) {
    return highlightCells.some(highlight => {
      const matchesRow = highlight.row === rowIndex;
      const matchesColumn = highlight.column === columnName || highlight.column === columnIndex;
      return matchesRow && matchesColumn;
    });
  }
  
  getHighlightStyleObjectForCard(rowIndex, columnName, columnIndex, highlightCells) {
    const highlight = highlightCells.find(h => {
      const matchesRow = h.row === rowIndex;
      const matchesColumn = h.column === columnName || h.column === columnIndex;
      return matchesRow && matchesColumn;
    });
    
    if (highlight) {
      let color = highlight.color;
      if (color === 'random') color = this.getRandomColor();

      // Theme-based default if no explicit color
      if (!color && window._swipecardsTheme?.primary) {
        const rgb = hexToRgb(window._swipecardsTheme.primary);
        const bg = toRgbaString(rgb, 0.18);
        const bd = toRgbaString(darkenRgb(rgb, 20), 0.9);
        return { backgroundColor: bg, border: `2px solid ${bd}`, fontWeight: 'bold' };
      }
      // Fallback to previous default
      color = color || '#FFD700';
      return { backgroundColor: color, border: `2px solid ${this.darkenColor(color, 20)}`, fontWeight: 'bold' };
    }
    return null;
  }
  
  isRowHighlightedForCard(rowIndex, highlightRows) {
    return highlightRows.some(highlight => highlight.row === rowIndex);
  }
  
  getRowHighlightStyleObjectForCard(rowIndex, highlightRows) {
    const highlight = highlightRows.find(h => h.row === rowIndex);
    
    if (highlight) {
      let color = highlight.color;
      if (color === 'random') color = this.getRandomColor();
      if (!color && window._swipecardsTheme?.primary) {
        const rgb = hexToRgb(window._swipecardsTheme.primary);
        const bg = toRgbaString(rgb, 0.12);
        const bd = toRgbaString(darkenRgb(rgb, 25), 0.8);
        return { backgroundColor: bg, border: `1px solid #111111`, fontWeight: '500' };
      }
      color = color || '#E3F2FD';
      return { backgroundColor: color, border: `1px solid #111111`, fontWeight: '500' };
    }
    return null;
  }
  
  isColumnHighlightedForCard(columnName, highlightColumns) {
    return highlightColumns.some(highlight => {
      return highlight.column === columnName || highlight.column === columnName;
    });
  }
  
  getColumnHighlightStyleObjectForCard(columnName, highlightColumns) {
    const highlight = highlightColumns.find(h => {
      return h.column === columnName || h.column === columnName;
    });
    
    if (highlight) {
      let color = highlight.color;
      if (color === 'random') color = this.getRandomColor();
      if (!color && window._swipecardsTheme?.primary) {
        const rgb = hexToRgb(window._swipecardsTheme.primary);
        const bg = toRgbaString(rgb, 0.12);
        const bd = toRgbaString(darkenRgb(rgb, 25), 0.8);
        return { backgroundColor: bg, border: `1px solid #111111`, fontWeight: '500' };
      }
      color = color || '#E8F5E8';
      return { backgroundColor: color, border: `1px solid #111111`, fontWeight: '500' };
    }
    return null;
  }
  
  renderPills(pills) {
    if (!pills || !Array.isArray(pills) || pills.length === 0) {
      return '';
    }
    const visible = pills.slice(0, this.maxVisiblePills);
    const hiddenCount = Math.max(0, pills.length - visible.length);

    const pillsHTML = visible.map(pill => 
      `<span class="card-pill">${this.escapeHtml(pill)}</span>`
    ).join('');

    const showAllBtn = hiddenCount > 0
      ? `<button type="button" class="pills-show-more-btn" aria-label="Show more pills (${hiddenCount} more)" title="Show more (${hiddenCount} more)">+${hiddenCount}</button>`
      : '';

    return `<div class="card-pills">${pillsHTML}${showAllBtn}</div>`;
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

    // Remove existing listeners so they don't accumulate
    topCard.removeEventListener('mousedown', this.handleStart);
    topCard.removeEventListener('touchstart', this.handleStart);
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('mouseup', this.handleEnd);
    document.removeEventListener('touchend', this.handleEnd);

    // Only bind swipe handlers when in swipe mode
    if (this.mode === 'swipe') {
      topCard.addEventListener('mousedown', this.handleStart);
      topCard.addEventListener('touchstart', this.handleStart, { passive: false });
      document.addEventListener('mousemove', this.handleMove);
      document.addEventListener('touchmove', this.handleMove, { passive: false });
      document.addEventListener('mouseup', this.handleEnd);
      document.addEventListener('touchend', this.handleEnd);
    }
  }
  
  handleStart(e) {
    if (this.mode !== 'swipe') return;

    // Block swipe initiation when pills modal is open
    if (this.pillsModalOpen) {
      e.stopPropagation();
      return;
    }

    // Ignore touches on toggle buttons and show-all pills buttons
    if (e.target.closest('.mode-toggle-btn') || e.target.closest('.pills-show-more-btn') || e.target.closest('.pills-modal')) {
      e.stopPropagation();
      return;
    }

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

  openPillsModal(cardIndex) {
    try {
      const card = this.cards[cardIndex] || this.cards[this.currentIndex];
      const pills = (card && Array.isArray(card.pills)) ? card.pills : [];
      if (!pills.length) return;

      // Build overlay
      let overlay = this.container.querySelector('.pills-modal-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'pills-modal-overlay';
        this.container.appendChild(overlay);
      }

      const modal = document.createElement('div');
      modal.className = 'pills-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');

      const header = document.createElement('div');
      header.className = 'pills-modal-header';
      header.innerHTML = `<div class="pills-modal-title">All Pills (${pills.length})</div><button class="pills-modal-close" aria-label="Close">×</button>`;

      const body = document.createElement('div');
      body.className = 'pills-modal-body';
      body.innerHTML = pills.map(p => `<span class="card-pill">${this.escapeHtml(p)}</span>`).join('');

      modal.appendChild(header);
      modal.appendChild(body);
      overlay.innerHTML = '';
      overlay.appendChild(modal);

      // Mark open and prevent swipe actions underneath
      this.pillsModalOpen = true;
      document.documentElement.classList.add('pills-modal-open');
    } catch (_) {}
  }

  closePillsModal() {
    const overlay = this.container.querySelector('.pills-modal-overlay');
    if (overlay) overlay.remove();
    this.pillsModalOpen = false;
    document.documentElement.classList.remove('pills-modal-open');
  }

  handleMove(e) {
    if (!this.isDragging || this.mode !== 'swipe') return;

    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

    this.currentX = clientX;
    this.currentY = clientY;

    if (!this.moveRaf) {
      this.moveRaf = requestAnimationFrame(() => {
        this.moveRaf = null;
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
      });
    }

    e.preventDefault();
  }

  handleEnd(e) {
    if (!this.isDragging || this.mode !== 'swipe') return;

    this.isDragging = false;
    if (this.moveRaf) {
      cancelAnimationFrame(this.moveRaf);
      this.moveRaf = null;
    }
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
    if (this.mode !== 'swipe') {
      this.showNotification('Press "Swipe" to be able to swipe');
      return;
    }
    if (this.isAnimating) return;
    this.isAnimating = true;
    const topCard = this.container.querySelector('.swipe-card:first-child');
    const card = this.cards[this.currentIndex];
    
    if (topCard && card) {
      topCard.classList.add('swiped-right');
      
      this.swipedCards.push({ index: this.currentIndex, action: 'right' });
      this.lastAction = { action: 'right', cardIndex: this.currentIndex };

      setTimeout(() => {
        this.currentIndex++;
        topCard.remove(); // Remove the swiped card from the DOM
        this.addNewCardToStack(); // Add a new card to the bottom
        this.updateCardStackClasses();
        this.updateSwipeCounter();
        this.bindEvents();
        if (this.currentIndex >= this.cards.length) {
          this.render();
        }
        this.sendResults();
        this.isAnimating = false;
        updateFrameHeightDebounced();
      }, 300);
    }
  }

  swipeLeft() {
    if (this.mode !== 'swipe') {
      this.showNotification('Press "Swipe" to be able to swipe');
      return;
    }
    if (this.isAnimating) return;
    this.isAnimating = true;
    const topCard = this.container.querySelector('.swipe-card:first-child');
    const card = this.cards[this.currentIndex];
    
    if (topCard && card) {
      topCard.classList.add('swiped-left');

      this.swipedCards.push({ index: this.currentIndex, action: 'left' });
      this.lastAction = { action: 'left', cardIndex: this.currentIndex };

      setTimeout(() => {
        this.currentIndex++;
        topCard.remove();
        this.addNewCardToStack();
        this.updateCardStackClasses();
        this.updateSwipeCounter();
        this.bindEvents();
        if (this.currentIndex >= this.cards.length) {
          this.render();
        }
        this.sendResults();
        this.isAnimating = false;
        updateFrameHeightDebounced();
      }, 300);
    }
  }

  goBack() {
    if (this.mode !== 'swipe') {
      this.showNotification('Press "Swipe" to be able to swipe');
      return;
    }
    if (this.isAnimating) return;

    // If no cards have been swiped yet, there's nothing to go back to
    if (this.swipedCards.length === 0) return;

    // Only set animating flag when we actually have work to do
    this.isAnimating = true;

    const lastSwiped = this.swipedCards.pop();
    this.currentIndex = lastSwiped.index;

    // Store the last action but don't send to Streamlit immediately
    this.lastAction = {
      action: 'back',
      cardIndex: this.currentIndex
    };

    this.render();
    this.bindEvents();
    this.updateSwipeCounter();
    this.sendResults();

    const topCard = this.container.querySelector('.swipe-card:first-child');
    if (topCard) {
      const directionClass =
        lastSwiped.action === 'left' ? 'return-from-left' : 'return-from-right';
      topCard.classList.add(directionClass);
      setTimeout(() => {
        topCard.classList.remove('return-from-left', 'return-from-right');
        this.isAnimating = false;
        updateFrameHeightDebounced();
      }, 300);
    } else {
      this.isAnimating = false;
      updateFrameHeightDebounced();
    }
  }

  addNewCardToStack() {
    const stack = this.container.querySelector('.cards-stack');
    const nextCardIndex = this.currentIndex + 4; // The 5th card from the new current

    if (nextCardIndex < this.cards.length && stack) {
      const card = this.cards[nextCardIndex];
      let cardContent = '';

      if (this.displayMode === 'table' && card.data) {
        cardContent = this.renderTableCard(card, nextCardIndex);
      } else {
        cardContent = this.renderImageCard(card);
      }

      const newCardHTML = `
        <div class="swipe-card" data-index="${nextCardIndex}">
          ${cardContent}
          <div class="action-indicator like">✔️</div>
          <div class="action-indicator pass">❌</div>
        </div>
      `;
      stack.insertAdjacentHTML('beforeend', newCardHTML);

      // Ensure new table cards are centered after being added to the DOM
      if (this.displayMode === 'table' && card.data) {
        setTimeout(() => {
          this.initializeAgGrid(nextCardIndex, card.row_index);
        }, 20);
      }
      updateFrameHeightDebounced();
    }
  }

  updateCardStackClasses() {
    const cards = this.container.querySelectorAll('.swipe-card');
    cards.forEach((card, i) => {
      card.classList.remove('card-front', 'card-second', 'card-third');
      
      // Update visibility for table cards
      if (this.displayMode === 'table') {
        const cardIndex = parseInt(card.getAttribute('data-index'));
        const gridContainer = card.querySelector(`#ag-grid-${cardIndex}`);
        
        if (gridContainer) {
          if (i <= 2) {
            // Show the first 3 cards
            gridContainer.style.visibility = 'visible';
            gridContainer.style.opacity = '1';
            gridContainer.style.zIndex = '';
          } else {
            // Hide cards beyond the third position but keep them rendered
            gridContainer.style.visibility = 'hidden';
            gridContainer.style.opacity = '0';
            gridContainer.style.zIndex = '-1';
          }
        }
      }
      
      if (i === 0) {
        card.classList.add('card-front');
        // Re-center the new front card if it needs recentering
        this.recenterFrontCard(card);
      } else if (i === 1) {
        card.classList.add('card-second');
      } else if (i === 2) {
        card.classList.add('card-third');
      }
    });
  }
  
  recenterFrontCard(cardElement) {
    if (this.displayMode !== 'table') return;
    
    const cardIndex = parseInt(cardElement.getAttribute('data-index'));
    const gridContainer = cardElement.querySelector(`#ag-grid-${cardIndex}`);
    
    // Simply ensure the grid is visible when it becomes the front card
    if (gridContainer) {
      gridContainer.style.visibility = 'visible';
      gridContainer.style.opacity = '1';
      gridContainer.style.zIndex = '';
      console.log(`Made card ${cardIndex} visible as front card`);
      // Also immediately autosize and center highlighted columns for this front card
      try {
        const card = this.cards?.[cardIndex];
        if (card) {
          const rowIndexToCenter =
            card.center_table_row !== null && card.center_table_row !== undefined
              ? card.center_table_row
              : (this.centerTableRow !== null && this.centerTableRow !== undefined
                  ? this.centerTableRow
                  : card.row_index);
          this.autosizeHighlightedColumnsForCard(cardIndex, rowIndexToCenter);
        }
      } catch (_) {}
    }
  }
  
  updateSwipeCounter() {
    const swipeCounter = this.container.querySelector('.swipe-counter');
    if (swipeCounter) {
      swipeCounter.textContent = `Swiped: ${this.swipedCards.length} | Remaining: ${this.cards.length - this.currentIndex}`;
      console.log('Updated counter:', swipeCounter.textContent);
    } else {
      console.warn('Swipe counter element not found');
    }
  }
  
  sendResults() {
    const results = {
      swipedCards: this.swipedCards.map(({ index, action }) => ({ index, action })),
      lastAction: this.lastAction,
      totalSwiped: this.swipedCards.length,
      remainingCards: this.cards.length - this.currentIndex,
    };
    sendValue(results);
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
    centerTableColumn = null,
    view = 'mobile',
    show_border = true,
    colors = null,
    table_font_size = 14,
    table_max_rows = null,
    table_max_columns = null,
    last_card_message = null
  } = event.detail.args;

  // If Streamlit theme is provided, apply it directly first
  if (event.detail && event.detail.theme) {
    applyStreamlitTheme(event.detail.theme);
  }

  // Apply theme detection immediately
  detectAndApplyTheme();

  // Set up theme monitoring for dynamic updates
  setupThemeMonitoring();

  // Apply card border preference
  const borderValue = show_border ? '1px solid var(--card-border-color)' : 'none';
  document.documentElement.style.setProperty('--card-border', borderValue);
  // Apply table font size
  if (table_font_size) {
    document.documentElement.style.setProperty('--table-font-size', `${table_font_size}px`);
  }
  // Apply button theming via CSS variables using Streamlit theme
  try {
    const root = document.documentElement.style;
    const textCol = (window._swipecardsTheme?.text || '').trim() ||
                    getComputedStyle(document.documentElement).getPropertyValue('--text-color')?.trim();
    
    // Get theme colors from multiple sources
    let primaryColor = window._swipecardsTheme?.primary;
    let backgroundColor = window._swipecardsTheme?.background || 
                         getComputedStyle(document.documentElement).getPropertyValue('--background-color')?.trim();
    let secondaryBgColor = window._swipecardsTheme?.secondaryBackground || 
                          getComputedStyle(document.documentElement).getPropertyValue('--secondary-background-color')?.trim();
    
    // Try to get colors from parent Streamlit app if not available
    if (!primaryColor || !backgroundColor) {
      try {
        const parentDoc = window.parent.document;
        const parentStyle = window.parent.getComputedStyle(parentDoc.documentElement);
        
        if (!primaryColor) {
          primaryColor = parentStyle.getPropertyValue('--primary-color')?.trim();
        }
        if (!backgroundColor) {
          backgroundColor = parentStyle.getPropertyValue('--background-color')?.trim();
        }
        if (!secondaryBgColor) {
          secondaryBgColor = parentStyle.getPropertyValue('--secondary-background-color')?.trim();
        }
      } catch (e) {
        console.log('Could not access parent document for theme colors');
      }
    }
    
    // Determine if we're in dark mode
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (primaryColor) {
      const base = hexToRgb(primaryColor) || { r: 102, g: 126, b: 234 };
      
      // Create theme-appropriate button colors
      const likeBg = toRgbaString(base, 1);
      const likeFg = bestTextOn(base);
      
      // For pass button, use a complementary color that works with the theme
      const passRgb = isDark ? lightenRgb(base, 20) : darkenRgb(base, 20);
      const passBg = toRgbaString(passRgb, 1);
      const passFg = bestTextOn(passRgb);
      
      // For back button, use secondary background with contrasting text
      const backBg = secondaryBgColor || (isDark ? '#262730' : '#ffffff');
      const backFg = textCol || (isDark ? '#fafafa' : '#262730');
      const borderCol = textCol || (isDark ? '#fafafa' : '#262730');
      
      root.setProperty('--btn-like-bg', likeBg);
      root.setProperty('--btn-like-fg', likeFg);
      root.setProperty('--btn-pass-bg', passBg);
      root.setProperty('--btn-pass-fg', passFg);
      root.setProperty('--btn-back-bg', backBg);
      root.setProperty('--btn-back-fg', backFg);
      root.setProperty('--btn-border', borderCol);
    } else {
      // Fallback: use theme-appropriate colors based on background
      const borderCol = textCol || (isDark ? '#fafafa' : '#262730');
      const backBg = secondaryBgColor || backgroundColor || (isDark ? '#262730' : '#F0F2F6');
      const backFg = textCol || (isDark ? '#fafafa' : '#262730');
      
      // Use consistent theme-based colors for all buttons
      const buttonBg = isDark ? '#262730' : '#F0F2F6';
      const buttonFg = isDark ? '#fafafa' : '#262730';
      
      root.setProperty('--btn-like-bg', buttonBg);
      root.setProperty('--btn-like-fg', buttonFg);
      root.setProperty('--btn-pass-bg', buttonBg);
      root.setProperty('--btn-pass-fg', buttonFg);
      root.setProperty('--btn-back-bg', buttonBg);
      root.setProperty('--btn-back-fg', buttonFg);
      root.setProperty('--btn-border', borderCol);
    }
  } catch (e) {}

  // Apply explicit color overrides from Python after theme and defaults
  try {
    if (colors && typeof colors === 'object') {
      const root = document.documentElement.style;

      // Helper to safely read nested values: a.b.c or fallback keys
      const get = (obj, path) => {
        try {
          return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
        } catch (_) { return undefined; }
      };

      // Common top-level or nested mappings for buttons
      const likeBg = get(colors, 'buttons.like.bg') ?? get(colors, 'like.bg') ?? colors.like_bg ?? colors.likeBg;
      const likeFg = get(colors, 'buttons.like.fg') ?? get(colors, 'like.fg') ?? colors.like_fg ?? colors.likeFg;
      const passBg = get(colors, 'buttons.pass.bg') ?? get(colors, 'pass.bg') ?? colors.pass_bg ?? colors.passBg;
      const passFg = get(colors, 'buttons.pass.fg') ?? get(colors, 'pass.fg') ?? colors.pass_fg ?? colors.passFg;
      const backBg = get(colors, 'buttons.back.bg') ?? get(colors, 'back.bg') ?? colors.back_bg ?? colors.backBg;
      const backFg = get(colors, 'buttons.back.fg') ?? get(colors, 'back.fg') ?? colors.back_fg ?? colors.backFg;
      const btnBorder = get(colors, 'buttons.border') ?? colors.btn_border ?? colors.button_border ?? colors.border;

      if (likeBg) root.setProperty('--btn-like-bg', likeBg);
      if (likeFg) root.setProperty('--btn-like-fg', likeFg);
      if (passBg) root.setProperty('--btn-pass-bg', passBg);
      if (passFg) root.setProperty('--btn-pass-fg', passFg);
      if (backBg) root.setProperty('--btn-back-bg', backBg);
      if (backFg) root.setProperty('--btn-back-fg', backFg);
      if (btnBorder) root.setProperty('--btn-border', btnBorder);

      // General colors
      const cardBg = colors.card_bg ?? colors.cardBg;
      const bg = colors.background_color ?? colors.backgroundColor;
      const secondaryBg = colors.secondary_background_color ?? colors.secondaryBackgroundColor;
      const text = colors.text_color ?? colors.textColor;

      if (bg) {
        root.setProperty('--background-color', bg);
        root.setProperty('--bg-color', bg);
      }
      if (secondaryBg) {
        root.setProperty('--secondary-background-color', secondaryBg);
        // Only override card bg with secondary if explicit card_bg not set
        if (!cardBg) root.setProperty('--card-bg', secondaryBg);
      }
      if (cardBg) root.setProperty('--card-bg', cardBg);
      if (text) {
        root.setProperty('--text-color', text);
        root.setProperty('--text-primary', text);
      }
    }
  } catch (e) {
    console.warn('Failed to apply explicit color overrides', e);
  }
  
  const root = document.getElementById('root');
  root.innerHTML = '<div class="swipe-container"></div>';

  const container = root.querySelector('.swipe-container');

  // Add table-mode class if needed
  if (display_mode === 'table') {
    container.classList.add('table-mode');
  }

  // Apply view styling based on the view parameter
  if (view === 'tablet') {
    container.classList.add('tablet-view');
  } else if (view === 'desktop') {
    container.classList.add('desktop-view');
  }
  // Also allow opting into desktop width via display_mode alias
  if (display_mode === 'desktop-view') {
    container.classList.add('desktop-view');
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
  const finalMessage = last_card_message ?? 'No more cards to swipe';
  swipeCards = new SwipeCards(
    container,
    cards,
    table_data,
    highlight_cells,
    highlight_rows,
    highlight_columns,
    display_mode,
    centerTableRow,
    centerTableColumn,
    finalMessage,
    {
      tableFontSize: table_font_size,
      tableMaxRows: table_max_rows,
      tableMaxColumns: table_max_columns,
    }
  );
  
  // Update frame height now and observe for subsequent changes
  updateFrameHeightImmediate();

  // Observe size changes to keep iframe height in sync
  try {
    if (!window._swipecards_resizeObserver) {
      const ro = new ResizeObserver(() => updateFrameHeightDebounced());
      ro.observe(document.documentElement);
      ro.observe(document.body);
      ro.observe(container);
      window._swipecards_resizeObserver = ro;
    }
  } catch (e) {
    // ResizeObserver may not be available in very old browsers
  }

  // Listen to viewport changes
  window.addEventListener('resize', () => {
    updateFrameHeightDebounced();
    try {
      // Nudge AG-Grid instances to recompute viewport if present,
      // but keep column widths as measured (no forced stretch)
      if (window.swipeCards && window.swipeCards.agGridInstances) {
        window.swipeCards.agGridInstances.forEach((grid) => {
          try {
            if (grid && grid.api && grid.api.onGridSizeChanged) {
              grid.api.onGridSizeChanged();
            }
          } catch (e) {}
        });
      }
    } catch (e) {}
  }, { passive: true });
  window.addEventListener('orientationchange', updateFrameHeightDebounced, { passive: true });
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
// Initial frame height
updateFrameHeightImmediate()
