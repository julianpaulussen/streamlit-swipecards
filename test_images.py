#!/usr/bin/env python3
"""
Test script to verify image URLs are working
"""
import requests

def test_image_url(url, name):
    try:
        response = requests.head(url, timeout=5)
        if response.status_code == 200:
            print(f"✅ {name}: {url} - OK ({response.status_code})")
            return True
        else:
            print(f"❌ {name}: {url} - Error ({response.status_code})")
            return False
    except Exception as e:
        print(f"❌ {name}: {url} - Exception: {e}")
        return False

# Test the image URLs
images = [
    ("Alice", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces"),
    ("Bob", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"),
    ("Carol", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces")
]

print("🧪 Testing image URLs...")
print("=" * 50)

all_good = True
for name, url in images:
    if not test_image_url(url, name):
        all_good = False

print("=" * 50)
if all_good:
    print("🎉 All image URLs are working!")
else:
    print("⚠️  Some image URLs have issues.")
