# UNDER DEVELOPMENT! - NOT FULLY TESTED!

# 💕 Streamlit Swipe Cards

A Tinder-like swipe cards component for Streamlit! Create beautiful, interactive card interfaces with smooth swipe animations.

## Features

- 🎴 **Stacked card interface** - Cards stack behind each other like Tinder
- 👆 **Touch & mouse support** - Swipe with finger or mouse
- 🎯 **Three actions** - Like (right), Pass (left), and Back
- 🎨 **Beautiful animations** - Smooth swipe animations with visual feedback
- 📱 **Mobile responsive** - Works great on all devices
- 🖼️ **Image support** - Upload files or use URLs
- ⚡ **Easy to use** - Simple Python API

## Installation instructions 

```sh
pip install streamlit-swipecards
```

## Usage instructions

```python
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

# Define your cards
cards = [
    {
        "name": "Alice Johnson",
        "description": "Software Engineer who loves hiking and photography",
        "image": "https://example.com/alice.jpg"
    },
    {
        "name": "Bob Smith", 
        "description": "Chef and foodie exploring the world",
        "image": "https://example.com/bob.jpg"
    }
]

# Create the swipe interface
result = streamlit_swipecards(cards=cards, key="swipe_cards")

# Handle the result
if result:
    st.write(f"You {result['action']} {result['card']['name']}!")
```

## Card Data Format

Each card should be a dictionary with these required fields:

```python
{
    "name": str,        # Person's name (required)
    "description": str, # Description text (required)
    "image": str       # Image URL or base64 data (required)
}
```

## Quick Start Examples

### Run the basic example:
```bash
streamlit run example.py
```

### Run the full demo with card creation:
```bash
streamlit run demo.py
```

## Actions

The component returns a dictionary when a user takes an action:

```python
{
    "card": {...},          # The card data that was acted upon
    "action": "right",      # Action taken: "right", "left", or "back"
    "cardIndex": 0         # Index of the card in the original list
}
```

## How to Use

1. **Swipe right** 💚 or click the like button to like a card
2. **Swipe left** ❌ or click the pass button to pass on a card  
3. **Click back** ↶ to undo your last action
4. Cards stack behind each other for a realistic experience
5. Smooth animations provide visual feedback

---

Made with ❤️ for the Streamlit community
