#!/usr/bin/env python3
"""
Simple example of the Tinder-like Swipe Cards component
"""
import streamlit as st
import pandas as pd
import tempfile
import os
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="Swipe Cards Example",
        # page_icon="",
        layout="centered"
    )
    
    st.title("Swipe Cards Example")
    st.write("Choose between image cards or table rows!")
    
    # Mode selection
    mode = st.radio(
        "Select display mode:",
        ["Image Cards", "Table Cards"],
        horizontal=True
    )
    
    if mode == "Image Cards":
        st.subheader("🖼️ Image Cards Mode")
        
        # Sample cards data
        sample_cards = [
            {
                "name": "Alice",
                "description": "Loves hiking and photography",
                "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces"
            },
            {
                "name": "Bob",
                "description": "Chef and food enthusiast",
                "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
            },
            {
                "name": "Carol",
                "description": "Artist and musician",
                "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces"
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
            key="image_example"
        )
    
    else:  # Table Cards
        st.subheader("📊 Table Cards Mode")
        
        # Create sample dataset
        data = {
            'Name': ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'],
            'Age': [28, 34, 26, 31],
            'Department': ['Engineering', 'Sales', 'Marketing', 'Engineering'],
            'Salary': [75000, 65000, 58000, 82000],
            'Experience': [5, 8, 3, 7]
        }
        df = pd.DataFrame(data)
        
        st.write("**Sample Dataset:**")
        st.dataframe(df)
        
        # Save to temporary CSV file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            df.to_csv(f.name, index=False)
            csv_path = f.name
        
        # Define cells to highlight
        highlight_cells = [
            {'row': 0, 'column': 'Salary', 'color': '#90EE90'},  # Light green for Alice's salary
            {'row': 2, 'column': 'Age', 'color': '#FFB6C1'},     # Light pink for Carol's age
        ]
        
        st.write("**Highlighted Cells:** Alice's Salary (Green), Carol's Age (Pink)")
        
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

if __name__ == "__main__":
    main()
