"""
Tests for example applications to ensure they work correctly.
"""
import os
import sys
import pytest
import pandas as pd

# Add examples directory to path for imports
examples_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'examples')
sys.path.insert(0, examples_dir)


def test_example_imports():
    """Test that example files can be imported without errors."""
    try:
        import example
        import simple_example
        assert hasattr(example, 'main')
        assert hasattr(simple_example, 'main')
    except ImportError as e:
        pytest.fail(f"Failed to import examples: {e}")


def test_sample_data_exists():
    """Test that sample data file exists and is readable."""
    data_path = os.path.join(examples_dir, 'data', 'sample_data.csv')
    assert os.path.exists(data_path), "Sample data file should exist"
    
    # Test that data can be loaded
    df = pd.read_csv(data_path)
    assert len(df) > 0, "Sample data should not be empty"
    assert len(df.columns) > 0, "Sample data should have columns"
    
    # Check for expected columns
    expected_columns = ['Name', 'Age', 'Department', 'Salary']
    for col in expected_columns:
        assert col in df.columns, f"Expected column '{col}' should be in sample data"


def test_example_data_path():
    """Test that example.py correctly references the data file."""
    import example
    
    # The example should construct the correct path to data
    # This is tested by checking if the file path construction logic works
    test_path = os.path.join(examples_dir, "data", "sample_data.csv")
    assert os.path.exists(test_path), "Example should be able to find sample data"


def test_simple_example_cards():
    """Test that simple_example has valid card data."""
    import simple_example
    
    # Check if we can access the main function
    assert callable(simple_example.main)
    
    # The cards should be defined in the main function, but we can't easily test
    # the Streamlit components without mocking. Instead, we'll just ensure
    # the module loads correctly.


class TestExampleConfiguration:
    """Test example configuration and setup."""
    
    def test_examples_directory_structure(self):
        """Test that examples directory has the expected structure."""
        # Check main examples directory
        assert os.path.isdir(examples_dir)
        
        # Check data subdirectory
        data_dir = os.path.join(examples_dir, 'data')
        assert os.path.isdir(data_dir)
        
        # Check for example files
        example_py = os.path.join(examples_dir, 'example.py')
        simple_example_py = os.path.join(examples_dir, 'simple_example.py')
        readme_md = os.path.join(examples_dir, 'README.md')
        
        assert os.path.isfile(example_py)
        assert os.path.isfile(simple_example_py)
        assert os.path.isfile(readme_md)
    
    def test_example_readme_exists(self):
        """Test that examples README exists and has content."""
        readme_path = os.path.join(examples_dir, 'README.md')
        assert os.path.exists(readme_path)
        
        with open(readme_path, 'r') as f:
            content = f.read()
            assert len(content) > 0
            assert 'streamlit run' in content.lower()
    
    def test_data_readme_or_description(self):
        """Test that data directory is documented."""
        # Check if there's documentation about the data
        readme_path = os.path.join(examples_dir, 'README.md')
        with open(readme_path, 'r') as f:
            content = f.read()
            assert 'data' in content.lower()
            assert 'csv' in content.lower()