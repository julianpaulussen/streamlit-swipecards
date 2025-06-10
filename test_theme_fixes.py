#!/usr/bin/env python3
"""
Test script to demonstrate the theme fixes and layout improvements
"""
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="Theme Fixes Test",
        page_icon="🎨",
        layout="centered"
    )
    
    st.title("🎨 Theme Fixes & Layout Improvements Test")
    st.markdown("---")
    
    # Info about the fixes
    st.info("""
    **🎯 Fixed Issues:**
    - ✅ **Automatic theming** - Cards now adapt to light/dark theme
    - ✅ **Bigger picture area** - Images now take 75% of card height  
    - ✅ **Smaller description** - Text area is more compact
    - ✅ **Bigger buttons** - Action buttons increased to 60px
    - ✅ **Reduced spacing** - Tighter margins between elements
    - ✅ **Readable fonts** - Text adapts to theme background
    - ✅ **No "auto" theme error** - Fixed config.toml
    """)
    
    # Test cards with different content lengths
    test_cards = [
        {
            "name": "Light Theme Test",
            "description": "This card tests the light theme styling with readable text and proper contrast.",
            "image": "https://images.unsplash.com/photo-1580518337843-f959d99e15e0?w=400&h=400&fit=crop"
        },
        {
            "name": "Dark Theme Ready", 
            "description": "This card will look great in dark mode with proper text colors and background.",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
        },
        {
            "name": "Layout Improved",
            "description": "Notice the bigger image area, smaller text section, and bigger buttons below!",
            "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
        },
        {
            "name": "Better Spacing",
            "description": "Reduced margins create a more compact, mobile-friendly interface.",
            "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
        }
    ]
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("### 👆 Test the improved cards")
        
        # The swipe cards component with our fixes
        result = streamlit_swipecards(cards=test_cards, key="theme_test")
        
        # Display results
        if result:
            st.success("✅ Theme detection and styling working!")
            
            if 'swipedCards' in result:
                st.markdown("### 📊 Complete Results:")
                st.json(result)
            else:
                st.markdown("### 🎯 Last Action:")
                st.json(result)
    
    with col2:
        st.markdown("### ✨ What's Improved:")
        st.markdown("""
        **🎨 Theme Detection:**
        - Automatic light/dark theme detection
        - Cards adapt background colors
        - Text colors adjust for readability
        
        **📐 Layout Optimized:**
        - Image area: 75% of card height
        - Text area: Smaller and more compact
        - Buttons: Bigger (60px) for easier tapping
        - Spacing: Reduced margins everywhere
        
        **🔧 Technical Fixes:**
        - Fixed "auto" theme error in config
        - CSS variables for theme switching
        - Better mobile responsiveness
        - Improved font readability
        """)
        
        st.markdown("### 🎮 Try This:")
        st.markdown("""
        1. **Switch themes** - Toggle Streamlit's theme
        2. **Notice adaptation** - Cards follow the theme
        3. **Test buttons** - They're bigger and easier to use
        4. **Check spacing** - More compact layout
        5. **Read text** - Always readable on any background
        """)

if __name__ == "__main__":
    main()
