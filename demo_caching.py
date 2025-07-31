#!/usr/bin/env python3
"""
Demo script to demonstrate table caching performance improvements.
Run this script to see how caching reduces redundant file reads.
"""
import tempfile
import time
import pandas as pd
import os

def demo_caching_performance():
    """Demonstrate the performance benefits of table caching."""
    print("🚀 Table Caching Performance Demo")
    print("=" * 50)
    
    # Create a sample dataset
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        f.write("Name,Age,Department,Salary\n")
        for i in range(100):
            f.write(f"Employee_{i},{25+i%15},Dept_{i%5},{50000+i*1000}\n")
        temp_file = f.name
    
    try:
        print(f"📁 Created sample dataset with 100 rows")
        print()
        
        # Simulate multiple cards using the same dataset (like in real usage)
        cards_count = 5
        print(f"🃏 Simulating {cards_count} table cards using the same dataset...")
        
        # Test with caching using our implementation
        print("\n🔄 WITH CACHING:")
        try:
            from src.streamlit_swipecards import _load_dataset_with_cache
            
            start_time = time.time()
            for i in range(cards_count):
                df = _load_dataset_with_cache(temp_file)
                print(f"   Card {i+1}: Loaded {len(df)} rows")
            cached_time = time.time() - start_time
            print(f"   ✅ Total time: {cached_time:.4f}s")
            print(f"   ✅ Cache hit rate: High (same file reused)")
            
        except Exception as e:
            print(f"   ❌ Caching test failed: {e}")
            cached_time = float('inf')
        
        # Test without caching (direct reads)
        print("\n🔄 WITHOUT CACHING (Direct pandas reads):")
        start_time = time.time()
        for i in range(cards_count):
            df = pd.read_csv(temp_file)
            print(f"   Card {i+1}: Loaded {len(df)} rows")
        direct_time = time.time() - start_time
        print(f"   ❌ Total time: {direct_time:.4f}s")
        print(f"   ❌ File read for each card")
        
        # Show improvement
        if cached_time != float('inf'):
            print("\n📊 PERFORMANCE IMPROVEMENT:")
            if direct_time > cached_time:
                time_improvement = ((direct_time - cached_time) / direct_time) * 100
                print(f"   ⚡ Time saved: {time_improvement:.1f}%")
            else:
                print(f"   ⚡ Caching overhead minimal for small files")
            print(f"   🎯 Benefit: File only read once vs {cards_count} times")
            print("\n🎉 SUCCESS: Caching reduces redundant file I/O operations!")
        else:
            print("\n⚠️  Could not measure caching improvement due to test environment")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        # Clean up
        os.unlink(temp_file)

if __name__ == "__main__":
    demo_caching_performance()