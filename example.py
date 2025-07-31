#!/usr/bin/env python3
"""
Simple example of the Tinder-like Swipe Cards component
"""
import streamlit as st
import pandas as pd
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
                "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
                "pills": ["Hiking", "Photography", "Adventure", "Nature"]
            },
            {
                "name": "Bob",
                "description": "Chef and food enthusiast",
                "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
                "pills": ["Cooking", "Food", "Travel", "Wine"]
            },
            {
                "name": "Carol",
                "description": "Artist and musician",
                "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
                "pills": ["Art", "Music", "Creative", "Guitar", "Painting"]
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
            key="image_example",
        )
    
    else:  # Table Cards
        st.subheader("📊 Table Cards Mode")
        
        # Load sample data from CSV file
        csv_path = os.path.join(os.path.dirname(__file__), "sample_data.csv")
        
        # Check if CSV file exists, if not create it
        if not os.path.exists(csv_path):
            st.error(f"Sample data file not found at {csv_path}")
            st.write("Please make sure sample_data.csv exists in the project directory.")
            return
        
        # Load and display the dataset
        try:
            df = pd.read_csv(csv_path)
            st.write("**Head of Sample Dataset:**")
            st.dataframe(df.head())  # Show only first 5 rows in preview
        except Exception as e:
            st.error(f"Error loading sample data: {str(e)}")
            return
        
        st.markdown("### Instructions:")
        st.markdown("- 👆 **Swipe right** or click 💚 to like the row")
        st.markdown("- 👆 **Swipe left** or click ❌ to pass the row")
        st.markdown("- 🔄 Click ↶ to go back")
        st.markdown("- ✅ Results will appear automatically when done")

        # Create table cards - each card represents a different row with its own configuration
        table_cards = [
            {
                "dataset_path": csv_path,
                "row_index": 0,  # Alice Johnson
                "name": "Alice Johnson",
                "description": "Engineering professional from New York",
                "pills": ["Engineer", "NYC", "Tech", "Senior"],
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
                "pills": ["Sales", "California", "Business"],
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
                "pills": ["Marketing", "Texas", "Creative", "Digital"],
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
            key="table_example"
        )
    
    # Show the result only when explicitly requested (when Get Results is clicked)
    if result and result.get('totalSwiped', 0) > 0:
        st.write("### Results:")
        st.json(result)

if __name__ == "__main__":
    main()
