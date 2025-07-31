# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Repository restructuring with dedicated examples folder
- Development infrastructure (pyproject.toml, pre-commit hooks, CI/CD)
- Simple example application for basic usage demonstration
- Comprehensive testing suite with pytest
- Contributing guidelines and documentation
- Development requirements file
- Modern Python packaging configuration

### Changed
- Moved example.py and sample_data.csv to examples/ directory
- Updated README.md with new project structure and installation instructions
- Improved .gitignore with comprehensive exclusions

### Infrastructure
- Added GitHub Actions CI workflow
- Added pre-commit hooks configuration
- Added type checking with mypy
- Added code formatting with black and isort
- Added linting with flake8

## [0.2.0] - Previous Release

### Features
- Tinder-like swipe card component for Streamlit
- Support for both image cards and table row swiping
- Cell, row, and column highlighting in table mode
- Like, pass, and undo actions
- Touch and mouse device support
- AG‑Grid powered table view
- Smooth animations and visual feedback

### API
- `streamlit_swipecards()` main component function
- Support for cards parameter with flexible card configurations
- Display modes: "cards" and "table"
- Highlighting options for cells, rows, and columns
- Centering capabilities for table view