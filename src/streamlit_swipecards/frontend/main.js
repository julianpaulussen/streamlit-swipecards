// The `Streamlit` object exists because our html file includes
// `streamlit-component-lib.js`.
// If you get an error about "Streamlit" not being defined, that
// means you're missing that file.

function sendValue(value) {
  Streamlit.setComponentValue(value)
}

class SwipeCards {
  constructor(container, cards) {
    this.container = container;
    this.cards = cards;
    this.currentIndex = 0;
    this.swipedCards = [];
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.lastAction = null; // Store the last action without sending immediately
    
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  render() {
    console.log('Rendering cards. CurrentIndex:', this.currentIndex, 'Total cards:', this.cards.length);
    
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
      
      console.log('Creating card for index:', cardIndex, 'Card name:', card.name);
      
      // Add position classes for consistent sizing
      let positionClass = '';
      if (i === 0) positionClass = 'card-front';
      else if (i === 1) positionClass = 'card-second';
      else if (i === 2) positionClass = 'card-third';
      
      cardsHTML += `
        <div class="swipe-card ${positionClass}" data-index="${cardIndex}">
          <img src="${card.image}" alt="${card.name}" class="card-image" 
               onerror="this.style.display='none'; this.nextElementSibling.style.paddingTop='40px';" />
          <div class="card-content">
            <h3 class="card-name">${card.name}</h3>
            <p class="card-description">${card.description}</p>
          </div>
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
  const { cards = [] } = event.detail.args;
  
  const root = document.getElementById('root');
  root.innerHTML = '<div class="swipe-container"></div>';
  
  const container = root.querySelector('.swipe-container');
  
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
  swipeCards = new SwipeCards(container, cards);
  
  // Set the frame height based on content
  Streamlit.setFrameHeight(750);
}

// Render the component whenever python send a "render event"
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
// Tell Streamlit that the component is ready to receive events
Streamlit.setComponentReady()
// Initial frame height
Streamlit.setFrameHeight(750)
