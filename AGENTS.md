# Repository Guidelines

## Project Structure & Module Organization
- `src/streamlit_swipecards/`: Python package exposing `streamlit_swipecards()`; frontend assets in `frontend/` (`index.html`, `main.js`, `style.css`).
- `example.py`: Minimal demo app to validate image and table modes.
- `requirements.txt`: Dev/runtime deps (includes `-e .` for editable installs).
- `setup.py`, `MANIFEST.in`, `LICENSE`, `README.md`: Packaging and docs.
- `build/`, `dist/`: Build artifacts (generated).
- `.github/workflows/publish_swipecards_workflow.yml`: PyPI publish on `v*` tags.

## Build, Test, and Development Commands
- Install deps: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`.
- Run demo locally: `streamlit run example.py` (verify swipes, buttons, and return payloads).
- Editable install: `pip install -e .` (imports the local package during development).
- Build package: `python -m build` or `python setup.py sdist bdist_wheel` (outputs to `dist/`).

## Coding Style & Naming Conventions
- Python: PEP 8, 4‑space indentation, prefer type hints as in `__init__.py`.
- Naming: snake_case for modules/functions, PascalCase for classes, constants UPPER_SNAKE.
- Public API: keep `streamlit_swipecards()` parameters/backwards compatibility; document changes in README.
- Frontend: keep logic in `frontend/main.js` and styles in `frontend/style.css`; avoid modifying `streamlit-component-lib.js`.

## Testing Guidelines
- No formal test suite yet. Validate via `streamlit run example.py` in both `display_mode="cards"` and `"table"`.
- Check dataset caching, cell/row/column highlighting, and undo/back behavior.
- If adding tests, use `pytest`, name files `test_*.py`, and place under `tests/`.

## Commit & Pull Request Guidelines
- Commits: short, imperative, and focused (e.g., `fix dark mode toggle`, `add lazy image loading`).
- PRs: include description, rationale, linked issues, and before/after screenshots or a short screen recording of the demo.
- Update README/API examples when changing component behavior; note breaking changes clearly.
- Ensure the demo runs cleanly and package builds before requesting review.

## Security & Configuration Tips
- Do not commit secrets; publishing uses `PYPI_API_TOKEN` via GitHub Actions.
- Keep assets small; reference large images via URLs. Avoid adding large datasets—use `sample_data*.csv` only for quick checks.
