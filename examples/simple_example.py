#!/usr/bin/env python3
"""
Simple example showing basic usage of streamlit-swipecards
"""
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="Simple Swipe Cards",
        layout="centered"
    )
    
    st.title("Simple Swipe Cards Demo")
    st.write("A minimal example showing the basics of streamlit-swipecards")
    
    # Simple image cards
    cards = [
        {
            "name": "Mountain View",
            "description": "Beautiful mountain landscape with snow-capped peaks",
            "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
        },
        {
            "name": "Ocean Sunset",
            "description": "Peaceful ocean view during golden hour",
            "image": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=400&fit=crop"
        },
        {
            "name": "Forest Path",
            "description": "Winding path through a lush green forest",
            "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop"
        },
        {
            "name": "City Lights",
            "description": "Urban skyline illuminated at night",
            "image": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop"
        }
    ]
    
    st.write("### Instructions:")
    st.write("👈 Swipe left to pass • 👉 Swipe right to like • ↶ Click to undo")
    
    # Create the swipe cards
    result = streamlit_swipecards(
        cards=cards,
        display_mode="cards",
        key="simple_cards"
    )
    
    # Show results
    if result:
        st.write("### 📊 Results:")
        
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Total Swiped", result.get('totalSwiped', 0))
        with col2:
            st.metric("Remaining Cards", result.get('remainingCards', len(cards)))
        
        if result.get('lastAction'):
            last = result['lastAction']
            action_emoji = "💚" if last['action'] == 'right' else "❌" if last['action'] == 'left' else "↶"
            st.write(f"**Last Action:** {action_emoji} Card {last['cardIndex'] + 1}")
        
        # Show detailed results in expander
        with st.expander("View detailed results"):
            st.json(result)

if __name__ == "__main__":
    main()