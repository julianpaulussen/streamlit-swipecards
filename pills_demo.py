#!/usr/bin/env python3
"""
Comprehensive test demonstrating the pills feature for both image and table cards
"""
import streamlit as st
import pandas as pd
import tempfile
import os
from streamlit_swipecards import streamlit_swipecards

def main():
    st.set_page_config(
        page_title="Pills Feature Demo",
        layout="centered"
    )
    
    st.title("🎯 Pills Feature Demo")
    st.write("Demonstrating the new pills parameter support in streamlit-swipecards")
    
    # Mode selection
    mode = st.radio(
        "Select display mode:",
        ["Image Cards with Pills", "Table Cards with Pills"],
        horizontal=True
    )

    if mode == "Image Cards with Pills":
        st.subheader("🖼️ Image Cards with Pills")
        
        # Image cards with various pill configurations
        image_cards = [
            {
                "name": "Tech Enthusiast",
                "description": "Passionate about emerging technologies",
                "image": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDI4NWY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+VGVjaDwvdGV4dD48L3N2Zz4=",
                "pills": ["Python", "React", "AI/ML", "Cloud"]
            },
            {
                "name": "Creative Designer",
                "description": "Visual storyteller with an eye for detail",
                "image": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2Yjk2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+RGVzaWduPC90ZXh0Pjwvc3ZnPg==",
                "pills": ["UI/UX", "Photoshop", "Figma", "Creative", "Responsive Design"]
            },
            {
                "name": "Data Scientist",
                "description": "Turning data into insights and predictions",
                "image": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzRhODUzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+RGF0YTwvdGV4dD48L3N2Zz4=",
                "pills": ["Statistics", "Machine Learning", "Data Visualization", "SQL", "R", "Python"]
            }
        ]
        
        st.write("Pills automatically wrap to multiple lines and maintain consistent styling.")
        
        result = streamlit_swipecards(
            cards=image_cards,
            display_mode="cards",
            key="image_pills_demo"
        )
        
    else:  # Table Cards with Pills
        st.subheader("📊 Table Cards with Pills")
        
        # Create sample dataset
        data = {
            'Employee': ['Sarah Chen', 'Mike Rodriguez', 'Emma Wilson', 'David Kim'],
            'Role': ['Software Engineer', 'Product Manager', 'Data Analyst', 'UI Designer'],
            'Department': ['Engineering', 'Product', 'Analytics', 'Design'],
            'Experience': ['5 years', '8 years', '3 years', '6 years'],
            'Skills': ['Python, React', 'Strategy, Agile', 'SQL, Tableau', 'Figma, CSS'],
            'Location': ['San Francisco', 'New York', 'Austin', 'Seattle']
        }
        df = pd.DataFrame(data)
        
        # Create temporary CSV
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            df.to_csv(f.name, index=False)
            temp_csv_path = f.name
        
        # Table cards with pills
        table_cards = [
            {
                "dataset_path": temp_csv_path,
                "row_index": 0,
                "name": "Sarah Chen",
                "description": "Senior Software Engineer specializing in full-stack development",
                "pills": ["Senior", "Full-Stack", "Team Lead", "Python Expert"],
                "center_table_row": 0,
                "center_table_column": "Employee"
            },
            {
                "dataset_path": temp_csv_path,
                "row_index": 1,
                "name": "Mike Rodriguez",
                "description": "Product Manager with strong strategic vision",
                "pills": ["Product Strategy", "Agile", "Leadership", "Cross-functional"],
                "center_table_row": 1,
                "center_table_column": "Employee"
            },
            {
                "dataset_path": temp_csv_path,
                "row_index": 2,
                "name": "Emma Wilson",
                "description": "Data Analyst turning insights into action",
                "pills": ["Analytics", "SQL", "Visualization", "Business Intelligence"],
                "center_table_row": 2,
                "center_table_column": "Employee"
            },
            {
                "dataset_path": temp_csv_path,
                "row_index": 3,
                "name": "David Kim",
                "description": "UI Designer creating beautiful user experiences",
                "pills": ["UI Design", "User Experience", "Design Systems", "Prototyping"],
                "center_table_row": 3,
                "center_table_column": "Employee"
            }
        ]
        
        st.write("Each table card shows employee data with custom pills below the description.")
        
        result = streamlit_swipecards(
            cards=table_cards,
            display_mode="table",
            key="table_pills_demo"
        )
        
        # Clean up temp file
        try:
            os.unlink(temp_csv_path)
        except:
            pass
    
    # Show results
    if result:
        st.write("### 📊 Interaction Results:")
        st.json(result)
        
        if result.get('totalSwiped', 0) > 0:
            st.success(f"Great! You've swiped {result['totalSwiped']} cards. The pills feature is working perfectly! 🎉")

if __name__ == "__main__":
    main()