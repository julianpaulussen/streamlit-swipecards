# Contributing to Streamlit Swipe Cards

Thank you for your interest in contributing to streamlit-swipecards! This document provides guidelines for contributing to the project.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/streamlit-swipecards.git
   cd streamlit-swipecards
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install development dependencies**
   ```bash
   pip install -r requirements-dev.txt
   ```

4. **Install pre-commit hooks (optional but recommended)**
   ```bash
   pre-commit install
   ```

## Development Workflow

### Code Quality

We use several tools to maintain code quality:

- **Black**: Code formatting
- **isort**: Import sorting
- **flake8**: Linting
- **mypy**: Type checking

Run all checks:
```bash
black src/ examples/ tests/
isort src/ examples/ tests/
flake8 src/ examples/ tests/
mypy src/
```

### Testing

Run tests before submitting:
```bash
pytest
```

Run tests with coverage:
```bash
pytest --cov=src/streamlit_swipecards --cov-report=html
```

### Examples

Test that examples still work:
```bash
cd examples
streamlit run example.py
```

## Project Structure

```
streamlit-swipecards/
├── src/streamlit_swipecards/    # Main package code
│   ├── __init__.py              # Component implementation
│   └── frontend/                # React frontend code
├── examples/                    # Example applications
│   ├── example.py              # Main example
│   ├── data/                   # Sample data files
│   └── README.md               # Examples documentation
├── tests/                      # Unit tests
├── docs/                       # Documentation (if any)
├── requirements.txt            # Runtime dependencies
├── requirements-dev.txt        # Development dependencies
├── pyproject.toml             # Modern Python packaging config
└── setup.py                   # Legacy setuptools config
```

## Contributing Guidelines

### Issues

- Check existing issues before creating new ones
- Use clear, descriptive titles
- Provide detailed descriptions with examples
- Add relevant labels

### Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the code style guidelines
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure examples still work

3. **Test your changes**
   ```bash
   pytest
   black --check src/ examples/ tests/
   flake8 src/ examples/ tests/
   ```

4. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commit format if possible

5. **Submit pull request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all checks pass

### Code Style

- Follow PEP 8 guidelines
- Use type hints where appropriate
- Write clear docstrings for functions and classes
- Keep functions and classes focused and small
- Use descriptive variable and function names

### Documentation

- Update README.md for user-facing changes
- Update docstrings for API changes
- Add examples for new features
- Keep documentation clear and concise

## Release Process

1. Update version in `pyproject.toml` and `setup.py`
2. Update `CHANGELOG.md` (if exists)
3. Create a release tag
4. Build and upload to PyPI

## Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Create a new issue with the "question" label
- Reach out to maintainers

We appreciate your contributions!