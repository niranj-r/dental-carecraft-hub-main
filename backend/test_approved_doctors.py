import requests
import json

def test_approved_doctors_only():
    """Test that only approved doctors are returned for appointment booking"""
    
    print("Testing /api/doctors endpoint...")
    
    try:
        # Get all doctors from the endpoint
        response = requests.get('http://127.0.0.1:5000/api/doctors')
        
        if response.status_code == 200:
            doctors = response.json()
            print(f"✅ Successfully fetched {len(doctors)} doctors")
            
            # Check if all returned doctors are approved
            all_approved = True
            for doctor in doctors:
                if doctor.get('status') != 'approved':
                    print(f"❌ Found non-approved doctor: {doctor.get('name')} (status: {doctor.get('status')})")
                    all_approved = False
            
            if all_approved:
                print("✅ All returned doctors are approved!")
                print("\nApproved doctors available for booking:")
                for doctor in doctors:
                    print(f"  - Dr. {doctor.get('name')} ({doctor.get('specialty')})")
            else:
                print("❌ Some non-approved doctors were returned")
                
        else:
            print(f"❌ Failed to fetch doctors: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")

if __name__ == "__main__":
    test_approved_doctors_only() 