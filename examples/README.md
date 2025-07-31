# Streamlit Swipe Cards Examples

This directory contains example applications that demonstrate how to use the streamlit-swipecards component.

## Running the Examples

### Prerequisites

Make sure you have streamlit-swipecards installed:

```bash
pip install streamlit-swipecards
```

Or install from source:

```bash
cd ..
pip install -e .
```

### Basic Example

Run the main example application:

```bash
streamlit run example.py
```

This example demonstrates both modes:
- **Image Cards Mode**: Swipe through profile cards with images
- **Table Cards Mode**: Swipe through data rows with highlighting and customization

### Simple Example

Run a minimal example showing basic usage:

```bash
streamlit run simple_example.py
```

### Advanced Example

Run the advanced table customization example:

```bash
streamlit run advanced_example.py
```

This example demonstrates:
- Complex highlighting patterns (cells, rows, columns)
- Custom color schemes for different data types
- Advanced table centering and navigation
- Results dashboard with detailed metrics
- Professional card layouts with role-based styling

## Example Features

### Image Cards
- Profile cards with names, descriptions, and images
- Swipe gestures (left/right) and button controls
- Like/pass/undo functionality

### Table Cards
- Interactive data table cards
- Cell, row, and column highlighting
- Customizable colors and centering
- Data from CSV files

## Data

The `data/` directory contains sample datasets used by the examples:
- `sample_data.csv`: Employee data with various fields for demonstration

## Customization

Feel free to modify the example files to:
- Use your own images or data
- Experiment with different highlighting schemes
- Create new card layouts
- Test different interaction patterns

## Adding New Examples

When creating new examples:
1. Create a new Python file in this directory
2. Import the component: `from streamlit_swipecards import streamlit_swipecards`
3. Add any sample data to the `data/` directory
4. Document your example in this README