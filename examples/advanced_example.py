#!/usr/bin/env python3
"""
Advanced example showing table customization features of streamlit-swipecards
"""
import streamlit as st
import pandas as pd
import os
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="Advanced Table Cards",
        layout="wide"
    )
    
    st.title("Advanced Table Cards Demo")
    st.write("Demonstrates advanced highlighting and customization features")
    
    # Load sample data
    csv_path = os.path.join(os.path.dirname(__file__), "data", "sample_data.csv")
    
    if not os.path.exists(csv_path):
        st.error("Sample data file not found!")
        return
    
    df = pd.read_csv(csv_path)
    
    # Display data overview
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("📊 Dataset Overview")
        st.dataframe(df.head(10), use_container_width=True)
    
    with col2:
        st.subheader("📈 Quick Stats")
        st.metric("Total Records", len(df))
        st.metric("Departments", df['Department'].nunique())
        st.metric("Avg Salary", f"${df['Salary'].mean():,.0f}")
    
    st.markdown("---")
    
    # Advanced table cards with custom highlighting
    st.subheader("🎨 Advanced Table Cards")
    st.write("Each card shows different highlighting techniques:")
    
    # Define advanced card configurations
    advanced_cards = [
        {
            "dataset_path": csv_path,
            "row_index": 0,  # Alice Johnson
            "name": "🏆 Top Performer",
            "description": "Engineering professional with high rating",
            "highlight_cells": [
                {"row": 0, "column": "Rating", "color": "#FFD700"},  # Gold
                {"row": 0, "column": "Salary", "color": "#90EE90"}   # Light green
            ],
            "highlight_rows": [{"row": 0, "color": "#E6F3FF"}],     # Light blue
            "center_table_row": 0,
            "center_table_column": "Rating"
        },
        {
            "dataset_path": csv_path,
            "row_index": 5,  # Frank Miller
            "name": "💻 Senior Engineer",
            "description": "DevOps expert with extensive experience",
            "highlight_cells": [
                {"row": 5, "column": "Experience", "color": "#FFB6C1"},  # Light pink
                {"row": 5, "column": "Projects", "color": "#DDA0DD"}     # Plum
            ],
            "highlight_columns": [{"column": "Skills", "color": "#F0F8FF"}],  # Alice blue
            "center_table_row": 5,
            "center_table_column": "Experience"
        },
        {
            "dataset_path": csv_path,
            "row_index": 12,  # Maya Patel
            "name": "🧠 AI Specialist",
            "description": "Data scientist with deep learning expertise",
            "highlight_cells": [
                {"row": 12, "column": "Department", "color": "#98FB98"},  # Pale green
                {"row": 12, "column": "Skills", "color": "#87CEEB"}       # Sky blue
            ],
            "highlight_rows": [{"row": 12, "color": "#FFF8DC"}],         # Cornsilk
            "center_table_row": 12,
            "center_table_column": "Skills"
        },
        {
            "dataset_path": csv_path,
            "row_index": 6,  # Grace Lee
            "name": "🎨 Creative Designer",
            "description": "UI/UX designer with modern skillset",
            "highlight_cells": [
                {"row": 6, "column": "Age", "color": "#F0E68C"},        # Khaki
                {"row": 6, "column": "Location", "color": "#E6E6FA"}    # Lavender
            ],
            "highlight_columns": [
                {"column": "Department", "color": "#F5F5DC"},           # Beige
                {"column": "Skills", "color": "#FFEFD5"}                # Papaya whip
            ],
            "center_table_row": 6,
            "center_table_column": "Department"
        },
        {
            "dataset_path": csv_path,
            "row_index": 10,  # Jack Wilson  
            "name": "📢 Marketing Expert",
            "description": "Content marketing and social media specialist",
            "highlight_cells": [
                {"row": 10, "column": "Experience", "color": "#FFA07A"},  # Light salmon
                {"row": 10, "column": "Rating", "color": "#20B2AA"}      # Light sea green
            ],
            "highlight_rows": [{"row": 10, "color": "#F5FFFA"}],        # Mint cream
            "center_table_row": 10,
            "center_table_column": "Experience"
        }
    ]
    
    # Instructions
    st.markdown("### Instructions:")
    st.markdown("- 👉 **Swipe right** or click 💚 to like the candidate")
    st.markdown("- 👈 **Swipe left** or click ❌ to pass")
    st.markdown("- ↶ **Click back** to undo your last action")
    st.markdown("- 📊 Notice the different highlighting patterns on each card")
    
    # Create the advanced table cards
    result = streamlit_swipecards(
        cards=advanced_cards,
        display_mode="table",
        key="advanced_table"
    )
    
    # Show results with detailed breakdown
    if result and result.get('totalSwiped', 0) > 0:
        st.markdown("---")
        st.subheader("📊 Results Dashboard")
        
        # Metrics row
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("👍 Total Swiped", result.get('totalSwiped', 0))
        with col2:
            st.metric("📋 Remaining", result.get('remainingCards', 0))
        with col3:
            liked_count = len([card for card in result.get('swipedCards', []) if card.get('action') == 'right'])
            st.metric("💚 Liked", liked_count)
        with col4:
            passed_count = len([card for card in result.get('swipedCards', []) if card.get('action') == 'left'])
            st.metric("❌ Passed", passed_count)
        
        # Last action
        if result.get('lastAction'):
            last = result['lastAction']
            action_map = {'right': '💚 Liked', 'left': '❌ Passed', 'back': '↶ Undid'}
            st.info(f"**Last Action:** {action_map.get(last['action'], last['action'])} card {last['cardIndex'] + 1}")
        
        # Detailed results
        with st.expander("📋 View detailed results"):
            st.json(result)
            
        # Show swiped cards summary
        if result.get('swipedCards'):
            st.subheader("📝 Swiping Summary")
            swiped_df = pd.DataFrame(result['swipedCards'])
            swiped_df['Action'] = swiped_df['action'].map({'right': '💚 Liked', 'left': '❌ Passed', 'back': '↶ Undid'})
            swiped_df['Card'] = swiped_df['index'] + 1
            st.dataframe(swiped_df[['Card', 'Action']], use_container_width=True)

if __name__ == "__main__":
    main()