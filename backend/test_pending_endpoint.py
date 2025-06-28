import requests
import json

def test_pending_doctors_endpoint():
    print("🧪 Testing pending doctors endpoint...")
    
    try:
        # Test the pending doctors endpoint
        response = requests.get('http://127.0.0.1:5000/api/doctors/pending')
        
        print(f"📡 Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data)} pending doctors:")
            
            for doctor in data:
                print(f"  - {doctor.get('name', 'Unknown')} ({doctor.get('specialty', 'Unknown')})")
                print(f"    Status: {doctor.get('status', 'Unknown')}")
                print(f"    Created: {doctor.get('created_at', 'Unknown')}")
                print(f"    Username: {doctor.get('username', 'Unknown')}")
                print()
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - Make sure the backend is running on http://127.0.0.1:5000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_pending_doctors_endpoint() 