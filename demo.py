import streamlit as st
from streamlit_swipecards import streamlit_swipecards
import base64
from io import BytesIO
from PIL import Image

def main():
    st.set_page_config(
        page_title="Tinder-like Swipe Cards",
        page_icon="💕",
        layout="wide"
    )
    
    st.title("💕 Tinder-like Swipe Cards Demo")
    st.markdown("Create your own swipe cards with custom data!")
    
    # Sidebar for creating cards
    with st.sidebar:
        st.header("🎴 Create Cards")
        
        # Initialize session state for cards
        if 'cards' not in st.session_state:
            st.session_state.cards = []
        
        with st.form("add_card_form"):
            st.subheader("Add New Card")
            
            name = st.text_input("Name", placeholder="Enter person's name")
            description = st.text_area(
                "Description", 
                placeholder="Enter a description...",
                height=100
            )
            
            # Image upload or URL
            image_option = st.radio("Image Source", ["Upload File", "Image URL"])
            
            if image_option == "Upload File":
                uploaded_file = st.file_uploader(
                    "Choose an image", 
                    type=['png', 'jpg', 'jpeg'],
                    help="Upload an image file"
                )
                image_data = None
                if uploaded_file is not None:
                    # Convert to base64
                    image = Image.open(uploaded_file)
                    # Resize to reasonable size
                    image.thumbnail((400, 400), Image.Resampling.LANCZOS)
                    buffered = BytesIO()
                    image.save(buffered, format="JPEG")
                    img_str = base64.b64encode(buffered.getvalue()).decode()
                    image_data = f"data:image/jpeg;base64,{img_str}"
            else:
                image_url = st.text_input(
                    "Image URL", 
                    placeholder="https://example.com/image.jpg"
                )
                image_data = image_url if image_url else None
            
            submitted = st.form_submit_button("Add Card")
            
            if submitted:
                if name and description and image_data:
                    new_card = {
                        "name": name,
                        "description": description,
                        "image": image_data
                    }
                    st.session_state.cards.append(new_card)
                    st.success(f"Added card for {name}!")
                    st.rerun()
                else:
                    st.error("Please fill in all fields!")
        
        # Display current cards
        st.subheader(f"Current Cards ({len(st.session_state.cards)})")
        
        if st.session_state.cards:
            for i, card in enumerate(st.session_state.cards):
                with st.expander(f"{card['name']}"):
                    if card['image'].startswith('data:'):
                        st.image(card['image'], width=100)
                    else:
                        st.image(card['image'], width=100)
                    st.write(card['description'])
                    if st.button(f"Remove", key=f"remove_{i}"):
                        st.session_state.cards.pop(i)
                        st.rerun()
        
        if st.button("Clear All Cards"):
            st.session_state.cards = []
            st.rerun()
        
        # Load sample data button
        if st.button("Load Sample Data"):
            st.session_state.cards = [
                {
                    "name": "Alice Johnson",
                    "description": "Software Engineer who loves hiking and photography. Always up for a good adventure!",
                    "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces"
                },
                {
                    "name": "Bob Smith", 
                    "description": "Chef and foodie exploring the world one dish at a time. Let's cook together!",
                    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
                },
                {
                    "name": "Carol Davis",
                    "description": "Artist and musician with a passion for creative expression and live music.",
                    "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces"
                },
                {
                    "name": "David Wilson",
                    "description": "Fitness enthusiast and outdoor adventurer. Looking for someone to share life's journeys with.",
                    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces"
                },
                {
                    "name": "Emma Thompson",
                    "description": "Bookworm and coffee enthusiast. Let's discuss our favorite novels over a latte!",
                    "image": "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=faces"
                }
            ]
            st.rerun()
    
    # Main content area
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("🎯 Swipe Cards")
        
        if not st.session_state.cards:
            st.info("👈 Add some cards using the sidebar to get started!")
            st.markdown("""
            ### How to use:
            1. **Add cards** using the sidebar form
            2. **Upload images** or use image URLs
            3. **Swipe right** 💚 to like, **swipe left** ❌ to pass
            4. Use the **back button** ↶ to undo your last action
            5. Or use the **action buttons** below the cards
            """)
        else:
            st.markdown(f"**{len(st.session_state.cards)} cards loaded** - Swipe away! 👆")
            
            # The swipe cards component
            result = streamlit_swipecards(
                cards=st.session_state.cards, 
                key="tinder_cards"
            )
    
    with col2:
        st.header("📊 Actions Log")
        
        # Initialize session state for results
        if 'swipe_results' not in st.session_state:
            st.session_state.swipe_results = []
        
        # Handle new results
        if result:
            # Avoid duplicates by checking if this exact result is already logged
            if not st.session_state.swipe_results or st.session_state.swipe_results[-1] != result:
                st.session_state.swipe_results.append(result)
        
        # Display results
        if st.session_state.swipe_results:
            st.write(f"**{len(st.session_state.swipe_results)} actions taken**")
            
            for i, res in enumerate(reversed(st.session_state.swipe_results[-10:])):  # Show last 10
                action_emoji = {
                    'right': '💚',
                    'left': '❌',
                    'back': '↶'
                }
                
                action_text = {
                    'right': 'Liked',
                    'left': 'Passed',
                    'back': 'Went back to'
                }
                
                with st.expander(
                    f"{action_emoji.get(res['action'], '❓')} {action_text.get(res['action'], 'Unknown')} {res['card']['name']}"
                ):
                    st.write(f"**Action:** {res['action']}")
                    st.write(f"**Card:** {res['card']['name']}")
                    st.write(f"**Description:** {res['card']['description']}")
            
            if st.button("Clear Action Log"):
                st.session_state.swipe_results = []
                st.rerun()
        else:
            st.info("No actions yet. Start swiping to see your activity here!")

if __name__ == "__main__":
    main()
