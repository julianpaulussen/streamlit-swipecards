# Streamlit Swipe Cards

A swipe cards component for Streamlit! Create beautiful, interactive card interfaces with smooth swipe animations. Now supports both image cards and table row swiping!

## Features

- 🎴 **Stacked card interface** - Cards stack behind each other
- 👆 **Touch & mouse support** - Swipe with finger or mouse
- 🎯 **Three actions** - Like (right), Pass (left), and Back
- 🎨 **Beautiful animations** - Smooth swipe animations with visual feedback
- 📱 **Mobile responsive** - Works great on all devices
- 🖼️ **Image support** - Upload files or use URLs
- 📊 **Table mode** - Swipe through dataset rows with AG-Grid
- 🎯 **Cell highlighting** - Highlight specific cells in table mode  
-  व्यू **Table View Centering** - Center the table on a specific row or column
- 🔧 **AG-Grid powered** - Professional data grid with sorting and scrolling
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

# Simple cell highlighting - one cell per card
highlight_cells = [
    {'row': 0, 'column': 'Salary', 'color': '#FFB6C1'},    # Alice's salary - Light Pink
    {'row': 1, 'column': 'Rating', 'color': '#98FB98'},    # Bob's rating - Pale Green  
    {'row': 2, 'column': 'Experience', 'color': '#87CEEB'}, # Carol's experience - Sky Blue
    {'row': 3, 'column': 'Projects', 'color': '#DDA0DD'},  # David's projects - Plum
]

result = streamlit_swipecards(
    dataset_path="sample_data.csv",
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
    highlight_rows=None,
    highlight_columns=None,
    display_mode="cards",
    center_table_row=None,
    center_table_column=None,
    key=None
)
```

**Parameters:**

- `cards` (list, optional): List of card dictionaries for image mode
- `dataset_path` (str, optional): Path to CSV/Excel file for table mode
- `highlight_cells` (list, optional): List of cells to highlight in table mode
- `highlight_rows` (list, optional): List of rows to highlight in table mode
- `highlight_columns` (list, optional): List of columns to highlight in table mode
- `display_mode` (str): Either "cards" or "table" (default: "cards")
- `center_table_row` (int, optional): Row index to center the table view on.
- `center_table_column` (str or int, optional): Column name or index to center the table view on.
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

Highlight specific cells in table mode to draw attention to important data:

```python
# Individual cell highlighting
highlight_cells = [
    {
        "row": 0,               # Row index (0-based)
        "column": "salary",     # Column name or index
        "color": "#90EE90"      # CSS color (optional)
    },
    {
        "row": 1,
        "column": "department", 
        "color": "random"       # Use 'random' for auto-generated colors
    },
    {
        "row": 2,
        "column": "skills"      # No color = default yellow highlighting
    }
]
```

**Advanced: Row and Column Highlighting**

For advanced use cases, you can also highlight entire rows and columns:

```python
# Entire row highlighting
highlight_rows = [
    {
        "row": 0,               # Row index to highlight
        "color": "#E3F2FD"      # Light blue background
    }
]

# Entire column highlighting  
highlight_columns = [
    {
        "column": "salary",     # Column name to highlight
        "color": "#E8F5E8"      # Light green background
    }
]
```

### Row and Column Highlighting
Highlight entire rows or columns:

```python
# Highlight specific rows
highlight_rows = [
    {"row": 0, "color": "#E3F2FD"},    # Light blue
    {"row": 2, "color": "random"}      # Random color
]

# Highlight specific columns
highlight_columns = [
    {"column": "salary", "color": "#E8F5E8"},     # Light green
    {"column": "department", "color": "#FFF8DC"}  # Light gold
]

result = streamlit_swipecards(
    dataset_path="data.csv",
    highlight_cells=highlight_cells,
    highlight_rows=highlight_rows,
    highlight_columns=highlight_columns,
    display_mode="table",
    key="enhanced_swiper"
)
```

### Table View Centering

You can control the initial viewport of the AG-Grid table to center on a specific row or column. This is useful for guiding the user's focus to a particular area of the dataset.

-   `center_table_row`: The row index to be vertically centered.
-   `center_table_column`: The column name or index to be horizontally centered.

If both are provided, the grid will attempt to center the specified cell in the viewport.

**Example:**

```python
result = streamlit_swipecards(
    dataset_path="data.csv",
    display_mode="table",
    center_table_row=5,
    center_table_column="Salary",
    key="centering_example"
)
```

**Color Options:**
- **Hex codes**: `#FF6B6B`, `#4ECDC4`, etc.
- **CSS names**: `red`, `blue`, `green`, etc.
- **`"random"`**: Automatically generates random colors
- **Omit color**: Uses defaults (yellow for cells, light blue for rows, light green for columns)

## Quick Start

### Run the main example:
```bash
streamlit run example.py
```

This will launch a demo with both image cards and table modes.

### Table-specific examples:
```bash
# Enhanced demos with coordinated highlighting
streamlit run enhanced_table_demo.py

# Interactive cell/row/column selection
streamlit run interactive_highlighting_demo.py

# Fixed dataset with multiple highlights per card
streamlit run table_example.py

# Simple demo with random highlights
streamlit run simple_demo.py

# AG-Grid integration test
streamlit run aggrid_test.py
```

The examples demonstrate:
- **Simple cell highlighting**: One cell highlighted per card
- **30 rows of employee data** for extensive scrolling
- **Fixed highlighting patterns** that don't reset on reload
- **Multiple color schemes** for visual variety
- **AG-Grid integration** with professional data display
- **Advanced features** (row/column highlighting) in specialized demos
- Professional scrolling and data presentation
- Single cell highlighting per card (not full rows)
- Various color options including random colors
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
