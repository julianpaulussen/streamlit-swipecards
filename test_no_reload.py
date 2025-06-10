#!/usr/bin/env python3
"""
Test script to demonstrate that swiping no longer reloads the site.
The key difference is that individual swipe actions are stored locally
and only sent to Streamlit when the user clicks "Get Results".
"""
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="No Reload Test",
        page_icon="🚀",
        layout="centered"
    )
    
    st.title("🚀 No Reload Test - Swipe Cards")
    st.markdown("---")
    
    # Info about the fix
    st.info("""
    **Fixed Issue:** Swiping cards no longer reloads the entire interface!
    
    **How it works now:**
    - Individual swipe actions are stored locally in the browser
    - The interface remains smooth and responsive
    - Click "📊 Get Results" button to send data to Streamlit
    - Only the "Get Results" action triggers communication with Streamlit
    """)
    
    # Sample cards
    test_cards = [
        {
            "name": "Test Card 1",
            "description": "Swipe me right! Notice how smooth it is - no reloading!",
            "image": "https://images.unsplash.com/photo-1580518337843-f959d99e15e0?w=400&h=400&fit=crop"
        },
        {
            "name": "Test Card 2", 
            "description": "Swipe me left! The interface stays responsive.",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
        },
        {
            "name": "Test Card 3",
            "description": "Use the back button! Everything works smoothly now.",
            "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
        },
        {
            "name": "Test Card 4",
            "description": "Final test card - swipe away and see the smooth animations!",
            "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
        }
    ]
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("### 👆 Swipe the cards - Notice no reloading!")
        
        # The swipe cards component
        result = streamlit_swipecards(cards=test_cards, key="no_reload_test")
        
        # Display results only when user clicks "Get Results"
        if result:
            st.success("✅ Results received from component!")
            
            if 'swipedCards' in result:
                st.markdown("### 📊 Complete Results:")
                st.json(result)
            else:
                st.markdown("### 🎯 Last Action:")
                st.json(result)
    
    with col2:
        st.markdown("### ✨ What's Fixed:")
        st.markdown("""
        ✅ **No more reloading** when swiping  
        ✅ **Smooth animations** preserved  
        ✅ **Responsive interface** maintained  
        ✅ **Results on demand** via button  
        ✅ **Local state management** in browser  
        ✅ **Counter shows progress** without reload  
        """)
        
        st.markdown("### 🎮 How to Test:")
        st.markdown("""
        1. **Swipe cards** left/right or use buttons
        2. **Notice** no page reload or flickering
        3. **Watch** the counter update smoothly
        4. **Click** "📊 Get Results" to see data
        5. **Enjoy** the smooth experience!
        """)

if __name__ == "__main__":
    main()
