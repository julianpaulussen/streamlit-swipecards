# 🎯 How to Use Your Tinder-like Swipe Cards Component

## 🚀 Getting Started

Your Tinder-like swipe cards component is now ready! Here's everything you need to know:

## 📁 Project Structure

```
streamlit-swipecards/
├── src/streamlit_swipecards/          # Main component code
│   ├── __init__.py                    # Python interface
│   └── frontend/                      # Frontend assets
│       ├── index.html                 # HTML structure
│       ├── main.js                    # Swipe logic & animations
│       ├── style.css                  # Tinder-like styling
│       └── streamlit-component-lib.js # Streamlit bridge
├── example.py                         # Simple example
├── demo.py                            # Full-featured demo
├── run_demo.sh                        # Easy startup script
└── README.md                          # Documentation
```

## 🎮 Running the Examples

### Option 1: Use the startup script
```bash
./run_demo.sh
```

### Option 2: Run directly
```bash
# Basic example
streamlit run example.py

# Full demo with card creation
streamlit run demo.py
```

## 🎴 Creating Your Own Cards

### Basic Card Structure
Each card needs these 3 fields:

```python
card = {
    "name": "Person's Name",           # Required
    "description": "About this person", # Required  
    "image": "image_url_or_base64"     # Required
}
```

### Example with Multiple Cards
```python
import streamlit as st
from streamlit_swipecards import streamlit_swipecards

# Your card data
my_cards = [
    {
        "name": "Alex",
        "description": "Adventure seeker and coffee lover ☕",
        "image": "https://your-image-url.com/alex.jpg"
    },
    {
        "name": "Sam", 
        "description": "Artist who paints the world in vibrant colors 🎨",
        "image": "https://your-image-url.com/sam.jpg"
    },
    {
        "name": "Jordan",
        "description": "Fitness enthusiast and weekend hiker 🏔️", 
        "image": "https://your-image-url.com/jordan.jpg"
    }
]

# Create the swipe interface
result = streamlit_swipecards(cards=my_cards, key="my_swiper")

# Handle user actions
if result:
    action = result['action']
    person = result['card']['name']
    
    if action == 'right':
        st.success(f"💚 You liked {person}!")
    elif action == 'left':
        st.info(f"❌ You passed on {person}")
    elif action == 'back':
        st.warning(f"↶ You went back to {person}")
```

## 📸 Using Images

### 1. Online Images (URLs)
```python
"image": "https://images.unsplash.com/photo-1234567890?w=400&h=400"
```

### 2. Uploaded Files (Base64)
```python
import base64
from PIL import Image
from io import BytesIO

uploaded_file = st.file_uploader("Upload image", type=['png', 'jpg', 'jpeg'])
if uploaded_file:
    image = Image.open(uploaded_file)
    image.thumbnail((400, 400))
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    image_data = f"data:image/jpeg;base64,{img_str}"
```

### 3. Local Files
```python
import base64

def get_base64_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode()

image_data = f"data:image/jpeg;base64,{get_base64_image('path/to/image.jpg')}"
```

## 🎛️ User Interactions

### Swipe Gestures
- **👆 Swipe Right**: Like the person (triggers 'right' action)
- **👆 Swipe Left**: Pass on the person (triggers 'left' action)
- **🖱️ Mouse Drag**: Works with mouse on desktop too!

### Button Controls  
- **💚 Like Button**: Same as swiping right
- **❌ Pass Button**: Same as swiping left
- **↶ Back Button**: Undo the last action

### Visual Feedback
- **Green heart 💚**: Appears when swiping right
- **Red X ❌**: Appears when swiping left
- **Smooth animations**: Cards slide and rotate naturally
- **Card stacking**: Up to 3 cards visible at once

## 📊 Handling Results

The component returns data when users interact:

```python
result = streamlit_swipecards(cards=my_cards)

if result:
    # Available data:
    card_data = result['card']        # Full card info
    action = result['action']         # 'right', 'left', or 'back'  
    index = result['cardIndex']       # Position in original list
    
    # Example usage:
    if action == 'right':
        # Save to "liked" list
        st.session_state.liked.append(card_data)
    elif action == 'left':  
        # Save to "passed" list
        st.session_state.passed.append(card_data)
```

## 🎨 Customization Tips

The component uses modern CSS and is mobile-responsive. Key features:
- **Gradient backgrounds** for a modern look
- **Smooth animations** with CSS transitions
- **Mobile-first design** that works on all devices
- **Accessibility features** with proper contrast and touch targets

## 🔧 Advanced Usage

### Session State Management
```python
# Initialize session state
if 'liked_people' not in st.session_state:
    st.session_state.liked_people = []
if 'passed_people' not in st.session_state:
    st.session_state.passed_people = []

# Handle results
result = streamlit_swipecards(cards=cards, key="advanced_swiper")
if result:
    if result['action'] == 'right':
        st.session_state.liked_people.append(result['card'])
    elif result['action'] == 'left':
        st.session_state.passed_people.append(result['card'])

# Display stats
st.sidebar.metric("Liked", len(st.session_state.liked_people))
st.sidebar.metric("Passed", len(st.session_state.passed_people))
```

### Dynamic Card Loading
```python
# Load more cards based on user preferences
def load_more_cards():
    # Your logic to fetch more cards
    return new_cards

if len(remaining_cards) < 3:
    remaining_cards.extend(load_more_cards())
```

## 🚀 Next Steps

1. **Test the examples** - Run `./run_demo.sh` to see it in action
2. **Create your own cards** - Replace the sample data with your content
3. **Add your logic** - Handle the swipe results for your use case
4. **Deploy your app** - Use Streamlit Cloud, Heroku, or your preferred platform

## 🎉 You're Ready!

Your Tinder-like swipe cards component is complete with:
- ✅ Smooth swipe animations
- ✅ Touch and mouse support  
- ✅ Three action buttons (like, pass, back)
- ✅ Card stacking effect
- ✅ Mobile responsiveness
- ✅ Beautiful modern UI
- ✅ Easy Python API

Have fun building your swipe-based applications! 💕
