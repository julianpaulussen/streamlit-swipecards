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
        
        # Create sample dataset with more data - use session state to prevent reloading
        if 'table_data' not in st.session_state:
            data = {
                'Name': ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eve Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Iris Chen', 'Jack Wilson'],
                'Age': [28, 34, 26, 31, 29, 35, 27, 32, 30, 26],
                'Department': ['Engineering', 'Sales', 'Marketing', 'Engineering', 'HR', 'Engineering', 'Design', 'Finance', 'Data Science', 'Marketing'],
                'Salary': [75000, 65000, 58000, 82000, 62000, 95000, 67000, 73000, 88000, 55000],
                'Experience': [5, 8, 3, 7, 4, 10, 4, 6, 7, 2],
                'Location': ['New York', 'California', 'Texas', 'New York', 'Florida', 'Seattle', 'California', 'New York', 'California', 'Texas'],
                'Skills': ['Python JavaScript', 'Sales CRM', 'Marketing Analytics', 'Java Python AWS', 'Recruiting Training', 'DevOps Kubernetes', 'UI/UX Design', 'Financial Analysis', 'Machine Learning', 'Content Marketing'],
                'Rating': [4.8, 4.5, 4.2, 4.9, 4.1, 4.7, 4.6, 4.3, 4.8, 4.0],
                'Projects': [12, 25, 8, 18, 15, 22, 14, 19, 16, 6]
            }
            st.session_state.table_data = pd.DataFrame(data)
            
            # Save to temporary CSV file and store path in session state
            with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
                st.session_state.table_data.to_csv(f.name, index=False)
                st.session_state.csv_path = f.name
        
        df = st.session_state.table_data
        csv_path = st.session_state.csv_path
        
        st.write("**Sample Dataset:**")
        st.dataframe(df)
        
        # Define fixed highlighting - one cell per card
        highlight_cells = [
            {'row': 0, 'column': 'Salary', 'color': '#FFB6C1'},    # Alice's salary - Light Pink
            {'row': 1, 'column': 'Rating', 'color': '#98FB98'},    # Bob's rating - Pale Green  
            {'row': 2, 'column': 'Experience', 'color': '#87CEEB'}, # Carol's experience - Sky Blue
            {'row': 3, 'column': 'Projects', 'color': '#DDA0DD'},  # David's projects - Plum
            {'row': 4, 'column': 'Salary', 'color': '#F0E68C'},    # Eve's salary - Khaki
            {'row': 5, 'column': 'Rating', 'color': '#FFA07A'},    # Frank's rating - Light Salmon
        ]
        
        st.write("**🎯 Fixed Highlighting:** Each card highlights one specific cell with a unique color")
        
        st.markdown("### Instructions:")
        st.markdown("- 👆 **Swipe right** or click 💚 to like the row")
        st.markdown("- 👆 **Swipe left** or click ❌ to pass the row") 
        st.markdown("- 🔄 Click ↶ to go back")
        st.markdown("- 📊 Click to get results when done")
        
        # Add centering options (commented out for fixed centering)
        # center_on_row = st.slider("Center on Row", 0, len(df) - 1, 0)
        # center_on_col = st.selectbox("Center on Column", df.columns, index=0)
        
        # Fixed centering values
        center_on_row = 9  # Center on row 3 (Carol Davis)
        center_on_col = "Salary"  # Center on Salary column

        # Create the table swipe cards
        result = streamlit_swipecards(
            dataset_path=csv_path,
            highlight_cells=highlight_cells,
            display_mode="table",
            center_table_row=center_on_row,
            center_table_column=center_on_col,
            key="table_example"
        )
    
    # Show the result only when explicitly requested (when Get Results is clicked)
    if result and result.get('totalSwiped', 0) > 0:
        st.write("### Results:")
        st.json(result)

if __name__ == "__main__":
    main()
