#!/usr/bin/env python3
"""
Simple example of the Tinder-like Swipe Cards component
"""
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="Swipe Cards Example",
        page_icon="💕",
        layout="centered"
    )
    
    st.title("💕 Swipe Cards Example")
    st.write("Here's a simple example of the Tinder-like swipe cards!")
    
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
    result = streamlit_swipecards(cards=sample_cards, key="example")
    
    # Show the result
    if result:
        st.write("### Last action:")
        st.json(result)

if __name__ == "__main__":
    main()
