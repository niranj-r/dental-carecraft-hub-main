import requests
import json

def test_doctor_registration():
    print("🧪 Testing doctor registration process...")
    
    # Test doctor registration data
    registration_data = {
        'username': 'dr_newtest',
        'password': 'password123',
        'role': 'doctor',
        'name': 'Dr. New Test Doctor',
        'specialty': 'General Dentistry',
        'contact': '+1 555-987-6543',
        'email': 'drnewtest@example.com',
        'licenseNumber': 'MD999888',
        'experience': '7',
        'education': 'DDS from Test University, General Practice Residency',
        'status': 'pending_approval'
    }
    
    try:
        print("📝 Submitting doctor registration...")
        response = requests.post('http://127.0.0.1:5000/api/register', 
                               json=registration_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"📡 Registration response status: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Doctor registration successful!")
            print(f"   Message: {data.get('message', 'No message')}")
            print(f"   Requires approval: {data.get('requires_approval', 'Unknown')}")
            
            # Now check if the doctor appears in pending list
            print("\n🔍 Checking pending doctors list...")
            pending_response = requests.get('http://127.0.0.1:5000/api/doctors/pending')
            
            if pending_response.status_code == 200:
                pending_doctors = pending_response.json()
                print(f"📊 Found {len(pending_doctors)} pending doctors:")
                
                for doctor in pending_doctors:
                    print(f"  - {doctor.get('name', 'Unknown')} ({doctor.get('specialty', 'Unknown')})")
                    print(f"    Username: {doctor.get('username', 'Unknown')}")
                    print(f"    Status: {doctor.get('status', 'Unknown')}")
                    print(f"    Created: {doctor.get('created_at', 'Unknown')}")
                    print()
                
                # Check if our new doctor is in the list
                new_doctor = next((d for d in pending_doctors if d.get('username') == 'dr_newtest'), None)
                if new_doctor:
                    print("✅ New doctor found in pending list!")
                else:
                    print("❌ New doctor not found in pending list")
            else:
                print(f"❌ Failed to fetch pending doctors: {pending_response.status_code}")
                
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - Make sure the backend is running on http://127.0.0.1:5000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_doctor_registration() 