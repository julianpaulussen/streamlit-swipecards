from pathlib import Path
from typing import Optional, List, Union
import pandas as pd

import streamlit as st
import streamlit.components.v1 as components

# Tell streamlit that there is a component called streamlit_swipecards,
# and that the code to display that component is in the "frontend" folder
frontend_dir = (Path(__file__).parent / "frontend").absolute()
_component_func = components.declare_component(
	"streamlit_swipecards", path=str(frontend_dir)
)

# Create the python function that will be called
def streamlit_swipecards(
    cards: Optional[list] = None,
    dataset_path: Optional[str] = None,
    highlight_cells: Optional[List[dict]] = None,
    display_mode: str = "cards",
    key: Optional[str] = None,
):
    """
    Create a Tinder-like swipe card component or table display.
    
    Parameters:
    -----------
    cards : list, optional
        List of dictionaries containing card data. Each dict should have:
        - name: str (required)
        - description: str (required) 
        - image: str (required - URL or base64 image)
    dataset_path : str, optional
        Path to a CSV/Excel dataset to display as table cards
    highlight_cells : list, optional
        List of dictionaries specifying cells to highlight. Each dict should have:
        - row: int (row index)
        - column: str or int (column name or index)
        - color: str (optional, default is yellow)
    display_mode : str
        Display mode: "cards" for image cards, "table" for table display
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
    
    # Load dataset if path is provided
    table_data = None
    if dataset_path:
        try:
            if dataset_path.endswith('.csv'):
                df = pd.read_csv(dataset_path)
            elif dataset_path.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(dataset_path)
            else:
                raise ValueError("Unsupported file format. Use CSV or Excel files.")
            
            # Convert DataFrame to table data format
            table_data = {
                'columns': df.columns.tolist(),
                'rows': df.values.tolist(),
                'total_rows': len(df),
                'total_columns': len(df.columns)
            }
            
            # If display_mode is table, convert table data to cards format
            if display_mode == "table":
                cards = []
                for i, row in enumerate(df.values):
                    card_data = {
                        'row_index': i,
                        'data': dict(zip(df.columns, row)),
                        'table_row': row.tolist()
                    }
                    cards.append(card_data)
                    
        except Exception as e:
            st.error(f"Error loading dataset: {str(e)}")
            table_data = None
    
    component_value = _component_func(
        cards=cards,
        table_data=table_data,
        highlight_cells=highlight_cells or [],
        display_mode=display_mode,
        key=key,
        default=None
    )

    return component_value


def main():
    st.write("## Tinder-like Swipe Cards Example")
    
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
    result = streamlit_swipecards(cards=sample_cards, key="swipe_cards")
    
    # Display the result
    if result:
        st.write("### Last Action:")
        st.json(result)


if __name__ == "__main__":
    main()
