#!/usr/bin/env python3
"""
Test script for BankNifty Analytics Backend
"""

import asyncio
import aiohttp
import json
from datetime import datetime

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_SYMBOLS = ["BANKNIFTY", "NIFTY", "TCS"]

async def test_health_check(session):
    """Test health check endpoint"""
    print("🏥 Testing health check...")
    try:
        async with session.get(f"{BASE_URL}/health") as response:
            if response.status == 200:
                data = await response.json()
                print(f"✅ Health check passed: {data}")
                return True
            else:
                print(f"❌ Health check failed: {response.status}")
                return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

async def test_quote_endpoint(session, symbol):
    """Test quote endpoint for a symbol"""
    print(f"📊 Testing quote endpoint for {symbol}...")
    try:
        payload = {"symbol": symbol, "period": "1d", "interval": "5m"}
        async with session.post(f"{BASE_URL}/api/quote", json=payload) as response:
            if response.status == 200:
                data = await response.json()
                print(f"✅ Quote for {symbol}: ₹{data.get('currentPrice', 'N/A')} ({data.get('dailyChangePercent', 'N/A')}%)")
                return True
            else:
                print(f"❌ Quote failed for {symbol}: {response.status}")
                return False
    except Exception as e:
        print(f"❌ Quote error for {symbol}: {e}")
        return False

async def test_multiple_quotes(session):
    """Test multiple quotes endpoint"""
    print("📈 Testing multiple quotes endpoint...")
    try:
        payload = {"symbols": TEST_SYMBOLS}
        async with session.post(f"{BASE_URL}/api/quotes", json=payload) as response:
            if response.status == 200:
                data = await response.json()
                print(f"✅ Multiple quotes: {len(data)} symbols fetched")
                for quote in data:
                    print(f"   {quote.get('symbol', 'N/A')}: ₹{quote.get('currentPrice', 'N/A')}")
                return True
            else:
                print(f"❌ Multiple quotes failed: {response.status}")
                return False
    except Exception as e:
        print(f"❌ Multiple quotes error: {e}")
        return False

async def test_chart_data(session, symbol):
    """Test chart data endpoint"""
    print(f"📈 Testing chart data for {symbol}...")
    try:
        payload = {"symbol": symbol, "period": "1d", "interval": "5m"}
        async with session.post(f"{BASE_URL}/api/chart", json=payload) as response:
            if response.status == 200:
                data = await response.json()
                print(f"✅ Chart data for {symbol}: {len(data)} data points")
                return True
            else:
                print(f"❌ Chart data failed for {symbol}: {response.status}")
                return False
    except Exception as e:
        print(f"❌ Chart data error for {symbol}: {e}")
        return False

async def test_technical_indicators(session, symbol):
    """Test technical indicators endpoint"""
    print(f"🧮 Testing technical indicators for {symbol}...")
    try:
        payload = {"symbol": symbol, "period": "1mo"}
        async with session.post(f"{BASE_URL}/api/technical-indicators", json=payload) as response:
            if response.status == 200:
                data = await response.json()
                print(f"✅ Technical indicators for {symbol}:")
                print(f"   RSI: {data.get('rsi', 'N/A')}")
                print(f"   MACD: {data.get('macd', 'N/A')}")
                print(f"   ATR: {data.get('atr', 'N/A')}")
                return True
            else:
                print(f"❌ Technical indicators failed for {symbol}: {response.status}")
                return False
    except Exception as e:
        print(f"❌ Technical indicators error for {symbol}: {e}")
        return False

async def test_search_endpoint(session):
    """Test search endpoint"""
    print("🔍 Testing search endpoint...")
    try:
        query = "BANK"
        async with session.get(f"{BASE_URL}/api/search/{query}") as response:
            if response.status == 200:
                data = await response.json()
                print(f"✅ Search for '{query}': {len(data)} results found")
                return True
            else:
                print(f"❌ Search failed: {response.status}")
                return False
    except Exception as e:
        print(f"❌ Search error: {e}")
        return False

async def run_all_tests():
    """Run all tests"""
    print("🚀 Starting BankNifty Analytics Backend Tests")
    print("=" * 50)
    print(f"📍 Testing backend at: {BASE_URL}")
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    async with aiohttp.ClientSession() as session:
        tests = [
            ("Health Check", test_health_check(session)),
            ("Multiple Quotes", test_multiple_quotes(session)),
            ("Search", test_search_endpoint(session)),
        ]
        
        # Add individual symbol tests
        for symbol in TEST_SYMBOLS:
            tests.extend([
                (f"Quote - {symbol}", test_quote_endpoint(session, symbol)),
                (f"Chart - {symbol}", test_chart_data(session, symbol)),
                (f"Indicators - {symbol}", test_technical_indicators(session, symbol)),
            ])
        
        # Run all tests
        results = []
        for test_name, test_coro in tests:
            try:
                result = await test_coro
                results.append((test_name, result))
            except Exception as e:
                print(f"❌ Test '{test_name}' crashed: {e}")
                results.append((test_name, False))
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 50)
        
        passed = 0
        total = len(results)
        
        for test_name, result in results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {test_name}")
            if result:
                passed += 1
        
        print("=" * 50)
        print(f"🎯 Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
        else:
            print("⚠️  Some tests failed. Check the backend logs for details.")
        
        print("=" * 50)

def main():
    """Main function"""
    try:
        asyncio.run(run_all_tests())
    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
    except Exception as e:
        print(f"\n💥 Test suite crashed: {e}")

if __name__ == "__main__":
    main()
