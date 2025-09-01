from pathlib import Path

import setuptools

this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()

setuptools.setup(
    name="streamlit-swipecards",
    version="0.4.7",
    author="Julian",
    author_email="julien.playsde@gmail.com",
    description="Streamlit Swipecards allow you to add interactive swipeable cards to your app. Supports both image cards and table row swiping with cell highlighting.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=setuptools.find_packages(where="src"),
    package_dir={"": "src"},
    include_package_data=True,
    classifiers=[],
    python_requires=">=3.7",
    install_requires=["streamlit>=1.2", "jinja2", "pandas", "openpyxl"],
)
