import requests
import json

def test_admin_login():
    print("🧪 Testing admin login endpoint...")
    
    try:
        # Test admin login
        login_data = {
            'username': 'admin',
            'password': 'admin123'
        }
        
        response = requests.post('http://127.0.0.1:5000/api/admin/login', 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"📡 Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Admin login successful!")
            print(f"   Username: {data.get('username')}")
            print(f"   Role: {data.get('role')}")
            print(f"   ID: {data.get('id')}")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - Make sure the backend is running on http://127.0.0.1:5000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_admin_login() 