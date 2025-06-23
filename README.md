# UNDER DEVELOPMENT! - NOT FULLY TESTED!

# 💕 Streamlit Swipe Cards

A swipe cards component for Streamlit! Create beautiful, interactive card interfaces with smooth swipe animations.

## Features

- 🎴 **Stacked card interface** - Cards stack behind each other
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

## Usage

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
    },
    {
        "name": "Carol Davis",
        "description": "Artist and musician exploring creativity",
        "image": "https://example.com/carol.jpg"
    }
]

# Create the swipe interface
result = streamlit_swipecards(cards=cards, key="swipe_cards")

# Handle the result
if result:
    st.write("### Last action:")
    st.json(result)
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

## Quick Start

### Run the example:
```bash
streamlit run example.py
```

This will launch a demo with three sample profiles using real Unsplash images, complete with instructions and action feedback.

## Return Value

The component returns a comprehensive dictionary with all swipe session data:

```python
{
    "swipedCards": [    
        {
            "card": {
                "name": "Alice",
                "description": "Loves hiking and photography",
                "image": "https://example.com/alice.jpg"
            },
            "action": "right", # "right" (like), "left" (pass), or "back" (undo)
            "index": 0 # Original index in the cards array
        },
        {
            "card": {
                "name": "Bob",
                "description": "Chef and food enthusiast", 
                "image": "https://example.com/bob.jpg"
            },
            "action": "right",
            "index": 1
        }
    ],
    "lastAction": {
        "card": {
            "name": "Bob",
            "description": "Chef and food enthusiast",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
        },
        "action": "right",
        "cardIndex": 1
    },
    "totalSwiped": 2, 
    "remainingCards": 1 
}
```

This comprehensive data structure allows you to:
- Track all user interactions with `swipedCards`
- React to the most recent action with `lastAction`
- Display progress with `totalSwiped` and `remainingCards`
- Build features like undo, analytics, or recommendation systems

You can use `st.json(result)` to display the full result object for debugging, as shown in the example above.

## How to Use

1. **Swipe right** 💚 or click the like button to like a card
2. **Swipe left** ❌ or click the pass button to pass on a card  
3. **Click back** ↶ to undo your last action
4. Cards stack behind each other for a realistic experience
5. Smooth animations provide visual feedback

---

Made with ❤️ for the Streamlit community
