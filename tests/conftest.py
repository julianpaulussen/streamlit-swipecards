# Test configuration and fixtures
import pytest
import pandas as pd
import tempfile
import os

@pytest.fixture
def sample_image_cards():
    """Sample image cards for testing."""
    return [
        {
            "name": "Test User 1",
            "description": "Test description 1",
            "image": "https://via.placeholder.com/400x400"
        },
        {
            "name": "Test User 2", 
            "description": "Test description 2",
            "image": "https://via.placeholder.com/400x400"
        }
    ]

@pytest.fixture
def sample_csv_data():
    """Sample CSV data for testing."""
    data = {
        'Name': ['Alice', 'Bob', 'Carol'],
        'Age': [25, 30, 35],
        'Department': ['Engineering', 'Sales', 'Marketing'],
        'Salary': [75000, 65000, 58000]
    }
    return pd.DataFrame(data)

@pytest.fixture
def temp_csv_file(sample_csv_data):
    """Temporary CSV file for testing."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        sample_csv_data.to_csv(f.name, index=False)
        yield f.name
    os.unlink(f.name)

@pytest.fixture
def sample_table_cards(temp_csv_file):
    """Sample table cards for testing."""
    return [
        {
            "dataset_path": temp_csv_file,
            "row_index": 0,
            "name": "Alice Card",
            "description": "Card for Alice",
            "highlight_cells": [{"row": 0, "column": "Salary"}]
        },
        {
            "dataset_path": temp_csv_file,
            "row_index": 1,
            "name": "Bob Card", 
            "description": "Card for Bob",
            "highlight_cells": [{"row": 1, "column": "Age"}]
        }
    ]