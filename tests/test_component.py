"""
Basic tests for streamlit-swipecards component functionality.
"""
import pytest
import pandas as pd
from unittest.mock import patch, MagicMock


def test_component_import():
    """Test that the component can be imported successfully."""
    from streamlit_swipecards import streamlit_swipecards
    assert callable(streamlit_swipecards)


def test_image_cards_basic(sample_image_cards):
    """Test basic image cards functionality."""
    from streamlit_swipecards import streamlit_swipecards
    
    # Mock streamlit components at the module level
    with patch('streamlit_swipecards._component_func') as mock_component:
        mock_component.return_value = None
        
        # Test calling with image cards
        result = streamlit_swipecards(
            cards=sample_image_cards,
            display_mode="cards",
            key="test_cards"
        )
        
        # Verify component was called
        mock_component.assert_called_once()
        call_kwargs = mock_component.call_args[1]
        
        assert call_kwargs['cards'] == sample_image_cards
        assert call_kwargs['display_mode'] == 'cards'
        assert call_kwargs['key'] == 'test_cards'


def test_table_cards_basic(sample_table_cards):
    """Test basic table cards functionality."""
    from streamlit_swipecards import streamlit_swipecards
    
    # Mock streamlit components at the module level
    with patch('streamlit_swipecards._component_func') as mock_component:
        mock_component.return_value = None
        
        # Test calling with table cards
        result = streamlit_swipecards(
            cards=sample_table_cards,
            display_mode="table",
            key="test_table"
        )
        
        # Verify component was called
        mock_component.assert_called_once()


def test_empty_cards():
    """Test behavior with empty cards list."""
    from streamlit_swipecards import streamlit_swipecards
    
    with patch('streamlit_swipecards._component_func') as mock_component:
        mock_component.return_value = None
        
        streamlit_swipecards(cards=[], key="empty_test")
        
        mock_component.assert_called_once()
        call_kwargs = mock_component.call_args[1]
        assert call_kwargs['cards'] == []


def test_default_parameters():
    """Test component with default parameters."""
    from streamlit_swipecards import streamlit_swipecards
    
    with patch('streamlit_swipecards._component_func') as mock_component:
        mock_component.return_value = None
        
        streamlit_swipecards()
        
        mock_component.assert_called_once()
        call_kwargs = mock_component.call_args[1]
        
        assert call_kwargs['cards'] == []
        assert call_kwargs['display_mode'] == 'cards'
        assert call_kwargs['highlight_cells'] == []
        assert call_kwargs['highlight_rows'] == []
        assert call_kwargs['highlight_columns'] == []