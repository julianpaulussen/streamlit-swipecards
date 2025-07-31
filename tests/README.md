# Tests directory

This directory contains unit tests for the streamlit-swipecards package.

## Running Tests

Install development dependencies:
```bash
pip install -r requirements-dev.txt
```

Run tests:
```bash
pytest
```

Run tests with coverage:
```bash
pytest --cov=src/streamlit_swipecards --cov-report=html
```

## Test Structure

- `test_component.py` - Tests for the main component functionality
- `test_examples.py` - Tests to ensure examples work correctly
- `conftest.py` - Shared test fixtures and configuration

## Adding Tests

When adding new features:
1. Create corresponding test files
2. Use descriptive test names
3. Include edge cases and error conditions
4. Ensure good test coverage

## Note

Currently, testing Streamlit components requires special considerations for the component lifecycle and JavaScript interactions. Basic functionality tests are provided as a starting point.