#!/usr/bin/env python3
"""
Test table cards with pills (without requiring external CSV)
"""
import streamlit as st
import pandas as pd
import tempfile
import os
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="Table Pills Test",
        layout="centered"
    )
    
    st.title("Table Cards with Pills Test")
    
    # Create a simple dataset in memory
    data = {
        'Name': ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
        'Department': ['Engineering', 'Sales', 'Marketing'],
        'Salary': [85000, 70000, 75000],
        'Location': ['New York', 'California', 'Texas']
    }
    df = pd.DataFrame(data)
    
    # Create a temporary CSV file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        df.to_csv(f.name, index=False)
        temp_csv_path = f.name
    
    # Test table cards with pills
    table_cards = [
        {
            "dataset_path": temp_csv_path,
            "row_index": 0,
            "name": "Alice Johnson",
            "description": "Senior Engineer with great experience",
            "pills": ["Senior", "Engineer", "NYC", "High Performer"],
            "center_table_row": 0,
            "center_table_column": "Name"
        },
        {
            "dataset_path": temp_csv_path,
            "row_index": 1,
            "name": "Bob Smith",
            "description": "Experienced sales professional",
            "pills": ["Sales", "California", "Team Lead"],
            "center_table_row": 1,
            "center_table_column": "Name"
        },
        {
            "dataset_path": temp_csv_path,
            "row_index": 2,
            "name": "Carol Davis",
            "description": "Creative marketing specialist",
            "pills": ["Marketing", "Creative", "Texas", "Digital Expert"],
            "center_table_row": 2,
            "center_table_column": "Name"
        }
    ]
    
    st.subheader("Table Cards with Pills")
    st.write("Each card shows a table row with custom pills below the description.")
    
    result = streamlit_swipecards(
        cards=table_cards,
        display_mode="table",
        key="table_pills_test"
    )
    
    if result:
        st.write("Result:", result)
    
    # Clean up the temporary file
    try:
        os.unlink(temp_csv_path)
    except:
        pass

if __name__ == "__main__":
    main()