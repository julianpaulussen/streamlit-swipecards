# 🃏 Streamlit Swipe Cards

[![PyPI version](https://badge.fury.io/py/streamlit-swipecards.svg)](https://badge.fury.io/py/streamlit-swipecards)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/streamlit-1.2+-red.svg)](https://streamlit.io)

A modern, interactive card-swiping component for Streamlit applications. Build interfaces with smooth animations for both image cards and data table rows.


## ✨ Features

- **Stacked Card Interface**: Card stacking with smooth animations
- **Dual Display Modes**: Support for both image cards and interactive data tables
- **Touch & Mouse Support**: Works seamlessly on desktop and mobile devices
- **Responsive Views**: Choose mobile or desktop layouts for card width
- **Interactive Actions**: Like ✔️, pass ❌, and undo ↶ functionality
- **Advanced Table Features**: Cell, row, and column highlighting with AG-Grid integration
- **Performance Optimized**: Automatic dataset caching for improved loading times
- **Return Values**: Get detailed feedback on user interactions and swipe patterns


## 📦 Installation

```bash
pip install streamlit-swipecards
```

## 🚀 Quick Start

```python
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

st.title("My Swipe App")

# Image cards example
cards = [
    {
        "name": "Alice",
        "description": "Loves hiking and photography",
        "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
    },
    {
        "name": "Bob", 
        "description": "Chef and food enthusiast",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    }
]

result = streamlit_swipecards(
    cards=cards,
    display_mode="cards",
    show_border=False,
    view="desktop",
    last_card_message="This is the last page. You can add your own text here",
    key="my_swipe_cards"
)

if result:
    st.json(result)
```

## 📋 API Reference

### `streamlit_swipecards()`

| Parameter | Type | Description |
|-----------|------|-------------|
| `cards` | `list[dict]` | List of card dictionaries (image or table cards) |
| `display_mode` | `str` | Display mode: `"cards"` or `"table"` |
| `dataset_path` | `str \| None` | Legacy single-dataset mode (deprecated) |
| `highlight_cells` | `list[dict] \| None` | Cell highlighting configuration |
| `highlight_rows` | `list[dict] \| None` | Row highlighting configuration |
| `highlight_columns` | `list[dict] \| None` | Column highlighting configuration |
| `center_table_row` | `int \| None` | Row to center in table view |
| `center_table_column` | `str \| None` | Column to center in table view |
| `view` | `str` | Layout: `"mobile"` (360px), `"tablet"` (800px), or `"desktop"` (full width) |
| `show_border` | `bool` | Show border around cards (default `True`) |
| `table_font_size` | `int` | Table font size in px (default `14`) |
| `table_max_rows` | `int \| None` | Max rows to render per table card (visual trim) |
| `table_max_columns` | `int \| None` | Max columns to render per table card (visual trim) |
| `colors` | `dict \| None` | Optional color overrides for buttons and base theme |
| `last_card_message` | `str \| None` | Message shown after all cards are swiped |
| `key` | `str \| None` | Unique component key |

**Returns:** `dict | None` - Interaction data including swiped cards, last action, and statistics

## 🎨 Card Types

### 🖼️ Image Cards
- **Custom Styling**: Flexible card layouts with names, descriptions, and images
- **Smooth Animations**: Swipe gestures and visual feedback

```python
{
    "name": "Alice Johnson",              # required
    "description": "Software Engineer",   # required  
    "image": "https://example.com/alice.jpg",  # required - URL or base64
    "pills": ["Python", "React", "AI"]   # optional - skill tags
}
```

### 📊 Table Cards
- **Data Row Swiping**: Transform spreadsheet rows into swipeable cards
- **Smart Highlighting**: Emphasize specific cells, rows, or columns
- **Automatic Centering**: Center on important data points

```python
{
    "dataset_path": "employees.csv",      # required - path to CSV/Excel
    "row_index": 0,                       # required - row to display
    "name": "Alice Johnson",              # optional - card title
    "description": "Engineering Team",    # optional - card subtitle
    "pills": ["Senior", "Remote"],        # optional - status tags
    "highlight_cells": [                  # optional - cell highlighting
        {"row": 0, "column": "Salary"}
    ],
    "highlight_rows": [                   # optional - row highlighting
        {"row": 0}
    ],
    "highlight_columns": [                # optional - column highlighting
        {"column": "Performance"}
    ],
    "center_table_row": 0,                # optional - center row
    "center_table_column": "Salary"       # optional - center column
}
```

## 🚦 Return Values

The component returns detailed interaction data:

```python
{
    "swipedCards": [
        {"index": 0, "action": "right"},   # Liked first card
        {"index": 1, "action": "left"}     # Passed second card
    ],
    "lastAction": {
        "cardIndex": 1, 
        "action": "left"
    },
    "totalSwiped": 2,      # Total cards swiped
    "remainingCards": 8    # Cards left in stack
}
```

## 🎨 Theme Integration

- Buttons and default table highlights adapt automatically to the active Streamlit theme.
- No flags required: the component derives colors from your app theme (or defaults if none is set).
- Adjust table readability with `table_font_size` (px); optionally trim rendered data with `table_max_rows` and `table_max_columns` for smaller layouts.

### Custom Colors

You can override component colors via the `colors` parameter. Provide valid CSS colors. Keys can be top-level or nested under `buttons`.

Example (customize button backgrounds and text):

```python
result = streamlit_swipecards(
    cards=cards,
    colors={
        # Buttons (top-level or nested under "buttons")
        "like_bg": "#22c55e",   # green
        "like_fg": "#ffffff",
        "pass_bg": "#ef4444",   # red
        "pass_fg": "#ffffff",
        "back_bg": "#374151",   # gray
        "back_fg": "#ffffff",
        "btn_border": "#ffffff",
        # Base colors (optional)
        "card_bg": "#1f2937",
        "background_color": "#0b0f16",
        "secondary_background_color": "#111827",
        "text_color": "#e5e7eb",
    },
)
```

Nested form also works:

```python
colors={
    "buttons": {
        "like": {"bg": "#22c55e", "fg": "#fff"},
        "pass": {"bg": "#ef4444", "fg": "#fff"},
        "back": {"bg": "#374151", "fg": "#fff"},
        "border": "#fff",
    }
}
```

## 🚀 Example App

A comprehensive example showcasing all features is provided in `example.py`:

```bash
streamlit run example.py
```

## 🛠️ Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/julianpaulussen/streamlit-swipecards.git
cd streamlit-swipecards

# Install dependencies
pip install -r requirements.txt

# Run the example
streamlit run example.py
```

### Building

```bash
# Build the package
python setup.py sdist bdist_wheel

# Install locally for testing
pip install -e .
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- Issues: [GitHub Issues](https://github.com/julianpaulussen/streamlit-swipecards/issues)
- Discussions: [GitHub Discussions](https://github.com/julianpaulussen/streamlit-swipecards/discussions)
- Email: julien.playsde@gmail.com
