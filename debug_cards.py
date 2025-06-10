#!/usr/bin/env python3
"""
Debug version to check why Alice's card isn't showing
"""
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="Debug Swipe Cards",
        page_icon="🔍",
        layout="centered"
    )
    
    st.title("🔍 Debug Swipe Cards")
    st.write("Let's debug why Alice isn't showing up...")
    
    # Sample cards data with debug info
    sample_cards = [
        {
            "name": "Alice (Index 0)",
            "description": "This should be the FIRST card shown",
            "image": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
        },
        {
            "name": "Bob (Index 1)",
            "description": "This should be the SECOND card",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
        },
        {
            "name": "Carol (Index 2)",
            "description": "This should be the THIRD card",
            "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
        }
    ]
    
    st.write("**Expected order:**")
    for i, card in enumerate(sample_cards):
        st.write(f"{i}: {card['name']} - {card['description']}")
    
    st.write("**Component:**")
    
    # Create the swipe cards with a unique key
    result = streamlit_swipecards(cards=sample_cards, key="debug_cards")
    
    # Show the result
    if result:
        st.write("### Last action:")
        st.json(result)
    
    st.write("**Instructions:** Open browser developer console (F12) to see debug logs")

if __name__ == "__main__":
    main()
