# Streamlit Swipe Cards

A modern card-swiping component for Streamlit. Build swipe interfaces using images or rows from a data table.

## Features
- **Stacked card interface** with smooth animations
- Works on both **touch** and **mouse** devices
- **Like**, **pass** and **undo** actions
- Optional **table view** powered by AG‑Grid
- **Cell, row and column highlighting** support

## Installation
```bash
pip install streamlit-swipecards
```

## Quick demo
Launch the sample app to see both modes in action:
```bash
streamlit run example.py
```

## Usage
### Image cards
```python
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

cards = [
    {"name": "Alice", "description": "Loves hiking", "image": "https://.../alice.jpg"\},
    {"name": "Bob", "description": "Chef and foodie", "image": "https://.../bob.jpg"\},
]

result = streamlit_swipecards(cards=cards, display_mode="cards", key="people")
if result:
    st.json(result)
```

### Table cards
Provide a list of card dictionaries. Each card points to the dataset and the row it should display. Highlighting and centering options are set per card.

```python
csv_path = "sample_data.csv"

cards = [
    {
        "dataset_path": csv_path,
        "row_index": 0,
        "name": "Alice Johnson",
        "description": "Engineering professional from New York",
        "highlight_cells": [{"row": 0, "column": "Salary", "color": "#FFB6C1"}],
        "center_table_row": 0,
        "center_table_column": "Salary",
    },
    {
        "dataset_path": csv_path,
        "row_index": 1,
        "name": "Bob Smith",
        "description": "Sales professional from California",
        "highlight_cells": [{"row": 1, "column": "Rating", "color": "#98FB98"}],
        "center_table_row": 1,
        "center_table_column": "Rating",
    },
]

result = streamlit_swipecards(cards=cards, display_mode="table", key="table")
if result:
    st.json(result)
```

## Card dictionaries
### Image card
```python
{
    "name": "Alice",       # required
    "description": "Text", # required
    "image": "URL or base64"
}
```

### Table card
```python
{
    "dataset_path": "data.csv",               # required
    "row_index": 0,                            # row to display
    "name": "Row title",                      # optional
    "description": "Row description",         # optional
    "highlight_cells": [{"row": 0, "column": "Salary", "color": "#FFB6C1"}],
    "highlight_rows": [{"row": 0, "color": "#E3F2FD"}],
    "highlight_columns": [{"column": "Rating", "color": "#E8F5E8"}],
    "center_table_row": 0,
    "center_table_column": "Salary"
}
```

## API reference
```python
streamlit_swipecards(
    cards=None,
    dataset_path=None,         # legacy single-dataset mode
    highlight_cells=None,
    highlight_rows=None,
    highlight_columns=None,
    display_mode="cards",      # "cards" or "table"
    center_table_row=None,
    center_table_column=None,
    key=None,
)
```

## Return value
The component returns a dictionary:
```python
{
    "swipedCards": [{"index": 0, "action": "right"}, ...],
    "lastAction": {"cardIndex": 0, "action": "right"},
    "totalSwiped": 3,
    "remainingCards": 7
}
```
Use this information to build analytics, undo functionality or any custom logic.
## How to Use

1. **Swipe right** 💚 or click the like button to like a card
2. **Swipe left** ❌ or click the pass button to pass on a card
3. **Click back** ↶ to undo your last action
4. Cards stack behind each other for a realistic experience
5. Smooth animations provide visual feedback


---
Released under the MIT License.
