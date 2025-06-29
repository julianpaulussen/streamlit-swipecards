# Streamlit Swipe Cards

A swipe cards component for Streamlit! Create beautiful, interactive card interfaces with smooth swipe animations. Now supports both image cards and table row swiping!

## Features

- 🎴 **Stacked card interface** - Cards stack behind each other
- 👆 **Touch & mouse support** - Swipe with finger or mouse
- 🎯 **Three actions** - Like (right), Pass (left), and Back
- 🎨 **Beautiful animations** - Smooth swipe animations with visual feedback
- 📱 **Mobile responsive** - Works great on all devices
- 🖼️ **Image support** - Upload files or use URLs
- 📊 **Table mode** - Swipe through dataset rows with highlighting
- 🎯 **Cell highlighting** - Highlight specific cells in table mode
- ⚡ **Easy to use** - Simple Python API

## Installation instructions 

```sh
pip install streamlit-swipecards
```

## Usage

### Image Cards Mode

```python
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

# Define your cards
cards = [
    {
        "name": "Alice Johnson",
        "description": "Software Engineer who loves hiking and photography",
        "image": "https://example.com/alice.jpg"
    },
    {
        "name": "Bob Smith", 
        "description": "Chef and foodie exploring the world",
        "image": "https://example.com/bob.jpg"
    }
]

# Create the swipe interface
result = streamlit_swipecards(
    cards=cards, 
    display_mode="cards",
    key="swipe_cards"
)

# Handle the result
if result:
    st.write("### Last action:")
    st.json(result)
```

### Table Mode

```python
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

# Swipe through CSV/Excel data
highlight_cells = [
    {'row': 0, 'column': 'salary', 'color': '#90EE90'},  # Green highlight
    {'row': 2, 'column': 'age', 'color': '#FFB6C1'},     # Pink highlight
]

result = streamlit_swipecards(
    dataset_path="path/to/your/data.csv",
    highlight_cells=highlight_cells,
    display_mode="table",
    key="table_swiper"
)
```
if result:
    st.write("### Last action:")
    st.json(result)
```

## API Reference

### streamlit_swipecards()

```python
streamlit_swipecards(
    cards=None,
    dataset_path=None,
    highlight_cells=None,
    display_mode="cards",
    key=None
)
```

**Parameters:**

- `cards` (list, optional): List of card dictionaries for image mode
- `dataset_path` (str, optional): Path to CSV/Excel file for table mode
- `highlight_cells` (list, optional): List of cells to highlight in table mode
- `display_mode` (str): Either "cards" or "table" (default: "cards")
- `key` (str, optional): Unique key for the component

## Card Data Format

### Image Cards Mode
Each card should be a dictionary with these required fields:

```python
{
    "name": str,        # Person's name (required)
    "description": str, # Description text (required)
    "image": str       # Image URL or base64 data (required)
}
```

### Table Mode
For table mode, use `dataset_path` to point to your CSV or Excel file. The component will automatically convert each row into a swipeable card.

### Cell Highlighting
Highlight specific cells in table mode:

```python
highlight_cells = [
    {
        "row": 0,           # Row index (0-based)
        "column": "salary", # Column name or index
        "color": "#90EE90"  # CSS color (optional, defaults to yellow)
    }
]
```

## Quick Start

### Run the main example:
```bash
streamlit run example.py
```

This will launch a demo with both image cards and table modes.

### Table-specific examples:
```bash
# Fixed dataset with highlighting
streamlit run table_example.py

# CSV file upload interface  
streamlit run csv_upload_example.py
```

The examples demonstrate:
- Image cards with real Unsplash photos
- Table cards with sample employee data
- Cell highlighting functionality
- CSV file upload and processing

## Return Value

The component returns a comprehensive dictionary with all swipe session data:

```python
{
    "swipedCards": [    
        {
            "card": {
                "name": "Alice",
                "description": "Loves hiking and photography",
                "image": "https://example.com/alice.jpg"
            },
            "action": "right", # "right" (like), "left" (pass), or "back" (undo)
            "index": 0 # Original index in the cards array
        },
        {
            "card": {
                "name": "Bob",
                "description": "Chef and food enthusiast", 
                "image": "https://example.com/bob.jpg"
            },
            "action": "right",
            "index": 1
        }
    ],
    "lastAction": {
        "card": {
            "name": "Bob",
            "description": "Chef and food enthusiast",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
        },
        "action": "right",
        "cardIndex": 1
    },
    "totalSwiped": 2, 
    "remainingCards": 1 
}
```

This comprehensive data structure allows you to:
- Track all user interactions with `swipedCards`
- React to the most recent action with `lastAction`
- Display progress with `totalSwiped` and `remainingCards`
- Build features like undo, analytics, or recommendation systems

You can use `st.json(result)` to display the full result object for debugging, as shown in the example above.

## How to Use

1. **Swipe right** 💚 or click the like button to like a card
2. **Swipe left** ❌ or click the pass button to pass on a card  
3. **Click back** ↶ to undo your last action
4. Cards stack behind each other for a realistic experience
5. Smooth animations provide visual feedback

---

Made with ❤️ for the Streamlit community
