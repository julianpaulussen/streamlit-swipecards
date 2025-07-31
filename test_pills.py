#!/usr/bin/env python3
"""
Simple test of the pills feature
"""
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="Pills Test",
        layout="centered"
    )
    
    st.title("Pills Feature Test")
    
    # Test image cards with pills
    st.subheader("Image Cards with Pills")
    
    sample_cards = [
        {
            "name": "Test User 1",
            "description": "This is a test description",
            "image": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIj5UZXN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==",
            "pills": ["Test", "Pills", "Feature", "Working"]
        },
        {
            "name": "Test User 2", 
            "description": "Another test card",
            "image": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIj5UZXN0IEltYWdlIDI8L3RleHQ+PC9zdmc+",
            "pills": ["Long Pill Name", "Short", "Another", "Really Long Pill Text", "More"]
        }
    ]
    
    result = streamlit_swipecards(
        cards=sample_cards,
        display_mode="cards", 
        key="pills_test"
    )
    
    if result:
        st.write("Result:", result)

if __name__ == "__main__":
    main()