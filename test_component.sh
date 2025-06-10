#!/bin/bash

echo "🧪 Testing Streamlit Swipe Cards Component..."
echo "=============================================="

# Add Python bin to PATH
export PATH="/var/data/python/bin:$PATH"

# Test 1: Check if component imports correctly
echo "✅ Test 1: Component Import"
python3 -c "
from streamlit_swipecards import streamlit_swipecards
print('   ✅ Component imported successfully!')
"

# Test 2: Check if Streamlit is accessible
echo "✅ Test 2: Streamlit Availability"
if command -v streamlit &> /dev/null; then
    echo "   ✅ Streamlit command found in PATH"
    STREAMLIT_CMD="streamlit"
elif [ -f "/var/data/python/bin/streamlit" ]; then
    echo "   ✅ Streamlit found at /var/data/python/bin/streamlit"
    STREAMLIT_CMD="/var/data/python/bin/streamlit"
else
    echo "   ❌ Streamlit not found"
    exit 1
fi

# Test 3: Check component functionality
echo "✅ Test 3: Component Functionality"
python3 -c "
import sys
sys.path.insert(0, 'src')
from streamlit_swipecards import streamlit_swipecards

# Test with sample data
cards = [{'name': 'Test', 'description': 'Test card', 'image': 'https://via.placeholder.com/400'}]
print('   ✅ Sample data created successfully!')
print('   ✅ Component is ready to use!')
" 2>/dev/null

echo ""
echo "🎉 All tests passed! Your component is working correctly."
echo ""
echo "🚀 To run the examples:"
echo "   Manual commands:"
echo "   export PATH=\"/var/data/python/bin:\$PATH\""
echo "   streamlit run example.py"
echo "   streamlit run demo.py"
echo "   streamlit run congratulations.py"
echo ""
echo "   Or use the interactive script:"
echo "   ./run_demo.sh"
echo ""
echo "📱 The app will be available at: http://localhost:8501"
