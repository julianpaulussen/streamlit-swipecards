#!/bin/bash

echo "🎨 Testing Theme Fixes and Layout Improvements"
echo "=============================================="
echo ""

# Add Python bin to PATH if needed
export PATH="/var/data/python/bin:$PATH"

echo "🚀 Starting theme test app..."
echo "📱 The app will open at: http://localhost:8501"
echo ""
echo "✨ What to test:"
echo "   - Cards should adapt to light/dark theme automatically"
echo "   - Images should be bigger (75% of card height)"
echo "   - Text description should be smaller and compact"
echo "   - Buttons should be larger (60px) and easier to tap"
echo "   - Spacing should be tighter and more mobile-friendly"
echo "   - Fonts should be readable on any background"
echo ""
echo "🎯 Try switching Streamlit's theme (Settings > Theme) to see adaptation!"
echo ""

# Check if streamlit is available
if ! command -v streamlit &> /dev/null; then
    echo "⚠️  Using full path to streamlit..."
    STREAMLIT_CMD="/var/data/python/bin/streamlit"
else
    STREAMLIT_CMD="streamlit"
fi

$STREAMLIT_CMD run test_theme_fixes.py --server.port 8501
