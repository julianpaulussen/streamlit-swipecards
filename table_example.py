#!/usr/bin/env python3
"""
Example of the Swipe Cards component with table display mode
"""
import streamlit as st
import pandas as pd
import tempfile
import os
from streamlit_swipecards import streamlit_swipecards

def create_sample_dataset():
    """Create a sample dataset for demonstration"""
    data = {
        'Name': ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eve Brown'],
        'Age': [28, 34, 26, 31, 29],
        'Department': ['Engineering', 'Sales', 'Marketing', 'Engineering', 'HR'],
        'Salary': [75000, 65000, 58000, 82000, 62000],
        'Experience': [5, 8, 3, 7, 4],
        'Location': ['New York', 'California', 'Texas', 'New York', 'Florida']
    }
    return pd.DataFrame(data)

def main():
    st.set_page_config(
        page_title="Table Swipe Cards Example",
        layout="centered"
    )
    
    st.title("📊 Table Swipe Cards Example")
    st.write("Swipe through rows of your dataset!")
    
    # Create sample dataset
    df = create_sample_dataset()
    
    # Save to temporary CSV file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        df.to_csv(f.name, index=False)
        csv_path = f.name
    
    st.subheader("Sample Dataset")
    st.dataframe(df)
    
    # Define cells to highlight
    highlight_cells = [
        {'row': 0, 'column': 'Salary', 'color': '#90EE90'},  # Light green for Alice's salary
        {'row': 2, 'column': 'Age', 'color': '#FFB6C1'},     # Light pink for Carol's age
        {'row': 3, 'column': 'Experience', 'color': '#87CEEB'}, # Sky blue for David's experience
    ]
    
    st.subheader("Highlighted Cells")
    st.write("- Alice's Salary (Green)")
    st.write("- Carol's Age (Pink)")  
    st.write("- David's Experience (Blue)")
    
    st.markdown("### Instructions:")
    st.markdown("- 👆 **Swipe right** or click 💚 to like the row")
    st.markdown("- 👆 **Swipe left** or click ❌ to pass the row") 
    st.markdown("- 🔄 Click ↶ to go back")
    st.markdown("- 📊 Click to get results when done")
    
    # Create the table swipe cards
    result = streamlit_swipecards(
        dataset_path=csv_path,
        highlight_cells=highlight_cells,
        display_mode="table",
        key="table_example"
    )
    
    # Clean up temporary file
    try:
        os.unlink(csv_path)
    except:
        pass
    
    # Show the result
    if result:
        st.write("### Last action:")
        st.json(result)
        
        if 'swipedCards' in result:
            st.write("### Summary of swiped rows:")
            liked_rows = [card for card in result['swipedCards'] if card['action'] == 'right']
            passed_rows = [card for card in result['swipedCards'] if card['action'] == 'left']
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.write(f"**Liked ({len(liked_rows)} rows):**")
                for card in liked_rows:
                    st.write(f"- Row {card['index'] + 1}")
            
            with col2:
                st.write(f"**Passed ({len(passed_rows)} rows):**")
                for card in passed_rows:
                    st.write(f"- Row {card['index'] + 1}")

if __name__ == "__main__":
    main()
