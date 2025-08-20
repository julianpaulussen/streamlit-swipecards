#!/usr/bin/env python3
import streamlit as st
import pandas as pd
import os
from streamlit_swipecards import streamlit_swipecards

st.set_page_config(page_title="Streamlit Swipe Cards Example")

st.write("# 📱 Streamlit Swipe Cards Demo")

st.markdown("""
This component brings swipe functionality to your Streamlit app!
Users can swipe through cards containing images or data with intuitive gestures.

## How to use:
1. **Install the component**: `pip install streamlit-swipecards`
2. **Import it**: `from streamlit_swipecards import streamlit_swipecards`
3. **Use it**: Create cards with images or data tables and let users swipe through them
""")

st.write("## 📱 Interactive Examples")

# Border toggle and mode selection
st.write("Choose customization options:")
show_border = st.checkbox("Show card borders", True)
use_theme_buttons = st.checkbox("Use theme for buttons", False)

view_option = st.radio(
    "Select view:",
    ["Mobile", "Desktop"],
    horizontal=True
)
view = "desktop" if view_option == "Desktop" else "mobile"

mode = st.radio(
    "Select display mode:",
    ["Image Cards", "Table Cards"],
    horizontal=True
)

# Table display controls
st.markdown("### Table display options:")
col_a, col_b, col_c = st.columns(3)
with col_a:
    table_font_size = st.slider("Font size (px)", 12, 20, 14)
with col_b:
    table_max_rows = st.number_input("Max rows (optional)", min_value=0, value=0, step=1, help="0 = show all")
with col_c:
    table_max_columns = st.number_input("Max columns (optional)", min_value=0, value=0, step=1, help="0 = show all")


if mode == "Image Cards":
    st.subheader("🖼️ Image Cards Mode")
    
    # Sample cards data
    sample_cards = [
        {
            "name": "Alice",
            "description": "Loves hiking and photography",
            "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"]
        },
        {
            "name": "Bob",
            "description": "Chef and food enthusiast",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"]
        },
        {
            "name": "Carol",
            "description": "Artist and musician",
            "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"]
        }
    ]
    
    st.markdown("### Instructions:")
    st.markdown("- 👆 **Swipe right** or click 💚 to like")
    st.markdown("- 👆 **Swipe left** or click ❌ to pass")
    st.markdown("- 🔄 Click ↶ to go back")

    # Create the swipe cards
    result = streamlit_swipecards(
        cards=sample_cards,
        display_mode="cards",
        show_border=show_border,
        use_theme_buttons=use_theme_buttons,
        view=view,
        last_card_message="This is the last page. You can add your own text here",
        key="image_example",
    )
    if result:
        st.session_state["swipe_results"] = result
else:  # Table Cards
    st.subheader("📊 Table Cards Mode")
    
    # Load sample data from CSV file
    csv_path = os.path.join(os.path.dirname(__file__), "sample_data.csv")
    
    # Check if CSV file exists, if not create it
    if not os.path.exists(csv_path):
        st.error(f"Sample data file not found at {csv_path}")
        st.write("Please make sure sample_data.csv exists in the project directory.")
        st.stop()
    
    # Load and display the dataset
    try:
        df = pd.read_csv(csv_path)
        st.write("**Head of Sample Dataset:**")
        st.dataframe(df.head())  # Show only first 5 rows in preview
    except Exception as e:
        st.error(f"Error loading sample data: {str(e)}")
        st.stop()
    
    st.markdown("### Instructions:")
    st.markdown("- 👆 **Swipe right** or click 💚 to like the row")
    st.markdown("- 👆 **Swipe left** or click ❌ to pass the row")
    st.markdown("- 🔄 Click ↶ to go back")

    use_theme_highlight = st.checkbox("Use theme for highlights", True,
        help="When no explicit color is provided for cell/row/column highlights, use the current theme colors.")
    

    # Create table cards - each card represents a different row with its own configuration
    table_cards = [
        {
            "dataset_path": csv_path,
            "row_index": 0,  # Alice Johnson
            "name": "Alice Johnson",
            "description": "Engineering professional from New York",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            # Demonstrates default highlighting colors for cell, row and column
            "highlight_cells": [{'row': 0, 'column': 'Salary'}],
            "highlight_rows": [{"row": 0}],
            "highlight_columns": [{"column": "Salary"}],
            "center_table_row": 0,
            "center_table_column": "Salary"
        },
        {
            "dataset_path": csv_path,
            "row_index": 1,  # Bob Smith
            "name": "Bob Smith",
            "description": "Sales professional from California",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            "highlight_cells": [{'row': 1, 'column': 'Rating', 'color': '#98FB98'}],
            "highlight_rows": [{"row": 1}],
            "highlight_columns": [{"column": "Rating"}],
            "center_table_row": 1,
            "center_table_column": "Rating"
        },
        {
            "dataset_path": csv_path,
            "row_index": 2,  # Carol Davis
            "name": "Carol Davis",
            "description": "Marketing specialist from Texas",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            "highlight_cells": [{'row': 2, 'column': 'Experience', 'color': '#87CEEB'}],
            "highlight_rows": [{"row": 2}],
            "highlight_columns": [{"column": "Experience"}],
            "center_table_row": 2,
            "center_table_column": "Experience"
        },
        {
            "dataset_path": csv_path,
            "row_index": 3,  # David Wilson
            "name": "David Wilson",
            "description": "Engineering manager from New York",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            "highlight_cells": [{'row': 3, 'column': 'Projects', 'color': '#DDA0DD'}],
            "highlight_rows": [{"row": 3}],
            "highlight_columns": [{"column": "Projects"}],
            "center_table_row": 3,
            "center_table_column": "Projects"
        },
        {
            "dataset_path": csv_path,
            "row_index": 4,  # Eve Brown
            "name": "Eve Brown",
            "description": "HR specialist from Florida",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            "highlight_cells": [{'row': 4, 'column': 'Salary', 'color': '#F0E68C'}],
            "highlight_rows": [{"row": 4}],
            "highlight_columns": [{"column": "Salary"}],
            "center_table_row": 4,
            "center_table_column": "Salary"
        },
        {
            "dataset_path": csv_path,
            "row_index": 5,
            "name": "Frank Miller",
            "description": "Senior engineer from Seattle",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            "highlight_cells": [{"row": 5, "column": "Salary", "color": "#FFD700"}],
            "highlight_rows": [{"row": 5}],
            "highlight_columns": [{"column": "Salary"}],
            "center_table_row": 5,
            "center_table_column": "Salary"
        },
        {
            "dataset_path": csv_path,
            "row_index": 6,
            "name": "Grace Lee",
            "description": "UI/UX designer based in California",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            "highlight_cells": [{"row": 6, "column": "Skills", "color": "#87CEEB"}],
            "highlight_rows": [{"row": 6}],
            "highlight_columns": [{"column": "Skills"}],
            "center_table_row": 6,
            "center_table_column": "Skills"
        },
        {
            "dataset_path": csv_path,
            "row_index": 8,
            "name": "Iris Chen",
            "description": "Data scientist specializing in ML & SQL",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            "highlight_cells": [{"row": 8, "column": "Rating", "color": "#98FB98"}],
            "highlight_rows": [{"row": 8}],
            "highlight_columns": [{"column": "Rating"}],
            "center_table_row": 8,
            "center_table_column": "Rating"
        },
        {
            "dataset_path": csv_path,
            "row_index": 9,
            "name": "Jack Wilson",
            "description": "Marketing associate from Texas",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            "highlight_cells": [{"row": 9, "column": "Experience", "color": "#FFA500"}],
            "highlight_rows": [{"row": 9}],
            "highlight_columns": [{"column": "Experience"}],
            "center_table_row": 9,
            "center_table_column": "Experience"
        },
        {
            "dataset_path": csv_path,
            "row_index": 10,
            "name": "Henry Taylor",
            "description": "Financial analyst from New York",
            "pills": ["Pill 1", "Pill 2", "Pill 3", "Pill 4"],
            "highlight_cells": [{"row": 10, "column": "Location", "color": "#E6E6FA"}],
            "highlight_rows": [{"row": 10}],
            "highlight_columns": [{"column": "Location"}],
            "center_table_row": 10,
            "center_table_column": "Location"
        }
    ]

    # Create the table swipe cards
    result = streamlit_swipecards(
        cards=table_cards,
        display_mode="table",
        show_border=show_border,
        use_theme_buttons=use_theme_buttons,
        use_theme_highlight=use_theme_highlight,
        table_font_size=table_font_size,
        table_max_rows=int(table_max_rows) if table_max_rows else None,
        table_max_columns=int(table_max_columns) if table_max_columns else None,
        view=view,
        center_table_row=0,
        center_table_column="Salary",
        last_card_message="This is the last page. You can add your own text here",
        key="table_example"
    )
    if result:
        st.session_state["swipe_results"] = result

if st.session_state.get("swipe_results"):
    st.write("### Results:")
    st.json(st.session_state["swipe_results"])

st.write("## 🛠️ Code Examples")

st.write("💡 **Tip**: You can create both image cards and table cards with rich customization options!")

st.markdown("""
### Image Cards Example
```python
from streamlit_swipecards import streamlit_swipecards

# Create image cards
sample_cards = [
    {
        "name": "Alice",
        "description": "Loves hiking and photography",
        "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
        "pills": ["Adventure", "Photography", "Nature"]
    },
    {
        "name": "Bob", 
        "description": "Chef and food enthusiast",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
        "pills": ["Cooking", "Food", "Travel"]
    }
]

result = streamlit_swipecards(
    cards=sample_cards,
    display_mode="cards",
    key="image_swiper"
)
```

### Table Cards Example  
```python
from streamlit_swipecards import streamlit_swipecards

# Create table cards with highlighting
table_cards = [
    {
        "dataset_path": "data.csv",
        "row_index": 0,
        "name": "Alice Johnson",
        "description": "Engineering professional from New York", 
        "pills": ["Engineer", "NYC", "Senior"],
        "highlight_cells": [{'row': 0, 'column': 'Salary'}],
        "highlight_rows": [{"row": 0}],
        "highlight_columns": [{"column": "Salary"}],
        "center_table_row": 0,
        "center_table_column": "Salary"
    }
]

result = streamlit_swipecards(
    cards=table_cards,
    display_mode="table", 
    key="table_swiper"
)
```
""")

st.write("## ⚙️ Parameters")

st.markdown("""
### streamlit_swipecards()
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `cards` | list[dict] | List of card objects to display | Yes |
| `display_mode` | str | Display mode: "cards" for images or "table" for data tables | Yes |
| `show_border` | bool | Whether to display a border around cards | No |
| `use_theme_buttons` | bool | Use Streamlit theme for like/back/pass buttons | No |
| `use_theme_highlight` | bool | Use theme colors for default highlights in table mode | No |
| `table_font_size` | int | Table font size (px) in table mode | No |
| `table_max_rows` | int | Max rows to render per table card | No |
| `table_max_columns` | int | Max columns to render per table card | No |
| `last_card_message` | str | Custom text shown when all cards are swiped | No |
| `key` | str | Unique component key for state management | Yes |

### Card Object (Image Cards)
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `name` | str | Name/title displayed on the card | Yes |
| `description` | str | Description text shown on the card | Yes |
| `image` | str | URL to the image to display | Yes |
| `pills` | list[str] | List of pill/tag labels to show | No |

### Card Object (Table Cards)
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `dataset_path` | str | Path to the CSV file containing data | Yes |
| `row_index` | int | Index of the row to highlight/center on | Yes |
| `name` | str | Name/title for the card | Yes |
| `description` | str | Description text for the card | Yes |
| `pills` | list[str] | List of pill/tag labels to show | No |
| `highlight_cells` | list[dict] | Cells to highlight: `[{'row': 0, 'column': 'Name', 'color': '#FF0000'}]` | No |
| `highlight_rows` | list[dict] | Rows to highlight: `[{'row': 0, 'color': '#00FF00'}]` | No |
| `highlight_columns` | list[dict] | Columns to highlight: `[{'column': 'Salary', 'color': '#0000FF'}]` | No |
| `center_table_row` | int | Row index to center the table view on | No |
| `center_table_column` | str | Column name to center the table view on | No |

**Returns:** `dict` - Result object containing swipe data and statistics
- `totalSwiped`: Total number of cards swiped
- `liked`: List of liked card indices
- `passed`: List of passed card indices
- `currentIndex`: Current card index being displayed
""")
