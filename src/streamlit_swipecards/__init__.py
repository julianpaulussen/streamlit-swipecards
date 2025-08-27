from pathlib import Path
from typing import Optional, List, Union
import pandas as pd
import os

import streamlit as st
import streamlit.components.v1 as components

# Tell streamlit that there is a component called streamlit_swipecards,
# and that the code to display that component is in the "frontend" folder
frontend_dir = (Path(__file__).parent / "frontend").absolute()
_component_func = components.declare_component(
	"streamlit_swipecards", path=str(frontend_dir)
)

@st.cache_data
def _load_dataset_cached(file_path: str, file_mtime: float) -> pd.DataFrame:
    """
    Load a dataset with caching based on file path and modification time.
    
    Args:
        file_path: Path to the dataset file
        file_mtime: File modification time (used as cache key)
    
    Returns:
        pd.DataFrame: Loaded dataset
    """
    if file_path.endswith('.csv'):
        return pd.read_csv(file_path, dtype=str).fillna("")
    elif file_path.endswith(('.xlsx', '.xls')):
        return pd.read_excel(file_path, dtype=str).fillna("")
    else:
        raise ValueError("Unsupported file format. Use CSV or Excel files.")

def _load_dataset_with_cache(file_path: str) -> pd.DataFrame:
    """
    Load a dataset using caching if the file exists, with cache invalidation based on file modification time.
    
    Args:
        file_path: Path to the dataset file
    
    Returns:
        pd.DataFrame: Loaded dataset
    
    Raises:
        FileNotFoundError: If the file doesn't exist
        ValueError: If the file format is not supported
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset file not found: {file_path}")
    
    # Get file modification time for cache invalidation
    file_mtime = os.path.getmtime(file_path)
    
    # Use cached loading function
    return _load_dataset_cached(file_path, file_mtime)

# Create the python function that will be called
def streamlit_swipecards(
    cards: Optional[list] = None,
    dataset_path: Optional[str] = None,
    highlight_cells: Optional[List[dict]] = None,
    highlight_rows: Optional[List[dict]] = None,
    highlight_columns: Optional[List[dict]] = None,
    display_mode: str = "cards",
    center_table_row: Optional[int] = None,
    center_table_column: Optional[Union[str, int]] = None,
    view: str = "mobile",
    show_border: bool = True,
    colors: Optional[dict] = None,
    # New styling and behavior parameters
    table_font_size: Optional[int] = 14,
    table_max_rows: Optional[int] = None,
    table_max_columns: Optional[int] = None,
    # Deprecated: theme flags are ignored; component always follows Streamlit theme
    use_theme_highlight: Optional[bool] = None,
    use_theme_buttons: Optional[bool] = None,
    last_card_message: Optional[str] = None,
    key: Optional[str] = None,
):
    """
    Create a swipe card component or table display.
    
    Parameters:
    -----------
    cards : list, optional
        List of dictionaries containing card data. 
        For image cards mode, each dict should have:
        - name: str (required)
        - description: str (required) 
        - image: str (required - URL or base64 image)
        - pills: list (optional - list of strings to display as pills)
        
        For table cards mode, each dict should have:
        - dataset_path: str (required - path to CSV/Excel file)
        - highlight_cells: list (optional - cells to highlight)
        - highlight_rows: list (optional - rows to highlight)  
        - highlight_columns: list (optional - columns to highlight)
        - center_table_row: int (optional - row to center on)
        - center_table_column: str/int (optional - column to center on)
        - name: str (optional - card title, defaults to "Row X")
        - description: str (optional - card description)
        - pills: list (optional - list of strings to display as pills)
    dataset_path : str, optional
        Path to a CSV/Excel dataset to display as table cards (legacy mode)
    highlight_cells : list, optional
        List of dictionaries specifying cells to highlight. Each dict should have:
        - row: int (row index)
        - column: str or int (column name or index)
        - color: str (optional, CSS color, 'random' for random color, default is gold)
    highlight_rows : list, optional
        List of dictionaries specifying rows to highlight. Each dict should have:
        - row: int (row index)
        - color: str (optional, CSS color, 'random' for random color, default is light blue)
    highlight_columns : list, optional
        List of dictionaries specifying columns to highlight. Each dict should have:
        - column: str or int (column name or index)
        - color: str (optional, CSS color, 'random' for random color, default is light green)
    display_mode : str
        Display mode: "cards" for image cards, "table" for table display
    center_table_row : int, optional
        Row index to center the table view on (legacy mode).
    center_table_column : str or int, optional
        Column name or index to center the table view on (legacy mode).
    view : str
        Screen view mode: "mobile" for default sizing, "tablet" for medium-width cards, "desktop" for full-width cards on large screens.
    show_border : bool, optional
        Whether to display a border around cards. Defaults to True.
    colors : dict, optional
        Optional color overrides for the component. Values should be valid CSS colors.
        Supported keys (either top-level or nested under "buttons") include:
        - like_bg / like.bg: background for the Like button
        - like_fg / like.fg: text color for the Like button
        - pass_bg / pass.bg: background for the Pass button
        - pass_fg / pass.fg: text color for the Pass button
        - back_bg / back.bg: background for the Back button
        - back_fg / back.fg: text color for the Back button
        - btn_border: border color for action buttons
        - card_bg: card background color
        - background_color: overall background color
        - secondary_background_color: secondary background (also used as card background if card_bg not set)
        - text_color: primary text color
    table_font_size : int, optional
        Font size (in px) for table cells and headers in table mode. Defaults to 14.
    table_max_rows : int, optional
        Maximum number of rows to render per table card (visual trimming only). If None, show all rows.
    table_max_columns : int, optional
        Maximum number of columns to render per table card (visual trimming only). If None, show all columns.
    use_theme_highlight : bool, optional
        Deprecated. The component now always uses the active Streamlit theme when no explicit highlight color is provided.
        This parameter is ignored and kept for backward compatibility.
    use_theme_buttons : bool, optional
        Deprecated. The component now always uses the active Streamlit theme for buttons. This parameter is ignored.
    last_card_message : str, optional
        Custom message to display when all cards have been swiped.
    key : str, optional
        Unique key for the component
        
    Returns:
    --------
    dict or None
        Dictionary containing swiped card data and action ('left', 'right', 'back')
        or None if no action has been taken
    """
    if cards is None:
        cards = []
    
    # Process cards for table mode - each card can have its own dataset and configuration
    if display_mode == "table" and cards:
        processed_cards = []
        for card_index, card in enumerate(cards):
            if isinstance(card, dict) and 'dataset_path' in card:
                # This is a table card with individual configuration
                try:
                    card_dataset_path = card['dataset_path']
                    df = _load_dataset_with_cache(card_dataset_path)
                    
                    # Get the specific row for this card (default to first row if not specified)
                    row_index = card.get('row_index', 0)
                    if row_index >= len(df):
                        row_index = 0
                    
                    row = df.iloc[row_index]
                    
                    # Create card data with individual configuration
                    card_data = {
                        'row_index': int(row_index),  # Convert to Python int
                        'data': {k: v.item() if hasattr(v, 'item') else v for k, v in dict(zip(df.columns, row)).items()},  # Convert numpy types
                        'table_row': [x.item() if hasattr(x, 'item') else x for x in row.tolist()],  # Convert numpy types
                        'dataset_path': card_dataset_path,
                        'highlight_cells': card.get('highlight_cells', []),
                        'highlight_rows': card.get('highlight_rows', []),
                        'highlight_columns': card.get('highlight_columns', []),
                        'center_table_row': card.get('center_table_row', int(row_index)),
                        'center_table_column': card.get('center_table_column', None),
                        'name': card.get('name', f"Row {int(row_index) + 1}"),
                        'description': card.get('description', f"Data from row {int(row_index) + 1}"),
                        'pills': card.get('pills', [])  # Add pills support
                    }
                    
                    # Store table data for this specific card (convert numpy types)
                    card_data['table_data'] = {
                        'columns': df.columns.tolist(),
                        'rows': [[x.item() if hasattr(x, 'item') else x for x in row] for row in df.values.tolist()],
                        'total_rows': int(len(df)),
                        'total_columns': int(len(df.columns))
                    }
                    
                    processed_cards.append(card_data)
                    
                except Exception as e:
                    st.error(f"Error loading dataset for card {card_index}: {str(e)}")
                    continue
            else:
                # Keep non-table cards as-is
                processed_cards.append(card)
        
        cards = processed_cards
    
    # Legacy: Load single dataset if path is provided (for backward compatibility)
    table_data = None
    if dataset_path:
        try:
            df = _load_dataset_with_cache(dataset_path)
            
            # Convert DataFrame to table data format (convert numpy types)
            table_data = {
                'columns': df.columns.tolist(),
                'rows': [[x.item() if hasattr(x, 'item') else x for x in row] for row in df.values.tolist()],
                'total_rows': int(len(df)),
                'total_columns': int(len(df.columns))
            }
            
            # If display_mode is table, convert table data to cards format
            if display_mode == "table":
                cards = []
                for i, row in enumerate(df.values):
                    card_data = {
                        'row_index': int(i),
                        'data': {k: v.item() if hasattr(v, 'item') else v for k, v in dict(zip(df.columns, row)).items()},
                        'table_row': [x.item() if hasattr(x, 'item') else x for x in row.tolist()]
                    }
                    cards.append(card_data)
                    
        except Exception as e:
            st.error(f"Error loading dataset: {str(e)}")
            table_data = None
    
    component_value = _component_func(
        cards=cards,
        table_data=table_data,
        highlight_cells=highlight_cells or [],
        highlight_rows=highlight_rows or [],
        highlight_columns=highlight_columns or [],
        display_mode=display_mode,
        centerTableRow=center_table_row,
        centerTableColumn=center_table_column,
        view=view,
        show_border=show_border,
        colors=colors or None,
        table_font_size=table_font_size,
        table_max_rows=table_max_rows,
        table_max_columns=table_max_columns,
        last_card_message=last_card_message,
        key=key,
        default=None
    )
    
    return component_value


def main():
    st.write("## Swipe Cards Example")
    
    # Sample data
    sample_cards = [
        {
            "name": "Alice Johnson",
            "description": "Software Engineer who loves hiking and photography. Always up for a good adventure!",
            "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces"
        },
        {
            "name": "Bob Smith", 
            "description": "Chef and foodie exploring the world one dish at a time. Let's cook together!",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
        },
        {
            "name": "Carol Davis",
            "description": "Artist and musician with a passion for creative expression and live music.",
            "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces"
        },
        {
            "name": "David Wilson",
            "description": "Fitness enthusiast and outdoor adventurer. Looking for someone to share life's journeys with.",
            "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces"
        }
    ]
    
    st.write("Swipe right to like, left to pass, or use the buttons below!")
    
    # Create the swipe cards component
    result = streamlit_swipecards(
        cards=sample_cards,
        key="swipe_cards",
        last_card_message="This is the last page. You can add your own text here",
    )
    
    # Display the result
    if result:
        st.write("### Last Action:")
        st.json(result)


if __name__ == "__main__":
    main()
