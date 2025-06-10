#!/bin/bash

# Add Python bin to PATH if needed
export PATH="/var/data/python/bin:$PATH"

echo "🚀 Starting Streamlit Swipe Cards Demo..."
echo "================================================"
echo ""
echo "Choose which demo to run:"
echo "1. Basic Example (example.py)"
echo "2. Full Demo with Card Creation (demo.py)"
echo "3. Feature Showcase (congratulations.py)"
echo ""
read -p "Enter your choice (1, 2, or 3): " choice

# Check if streamlit is available
if ! command -v streamlit &> /dev/null; then
    echo "⚠️  Streamlit not found in PATH. Using full path..."
    STREAMLIT_CMD="/var/data/python/bin/streamlit"
else
    STREAMLIT_CMD="streamlit"
fi

case $choice in
    1)
        echo "Starting basic example..."
        echo "🌐 Open your browser to: http://localhost:8501"
        $STREAMLIT_CMD run example.py --server.port 8501
        ;;
    2)
        echo "Starting full demo..."
        echo "🌐 Open your browser to: http://localhost:8501"
        $STREAMLIT_CMD run demo.py --server.port 8501
        ;;
    3)
        echo "Starting feature showcase..."
        echo "🌐 Open your browser to: http://localhost:8501"
        $STREAMLIT_CMD run congratulations.py --server.port 8501
        ;;
    *)
        echo "Invalid choice. Starting basic example..."
        echo "🌐 Open your browser to: http://localhost:8501"
        $STREAMLIT_CMD run example.py --server.port 8501
        ;;
esac
