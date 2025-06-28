import requests
import random
import string

def random_string(length=5):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def bulk_register_doctors(n=5):
    for i in range(n):
        username = f"dr_bulk_{random_string()}"
        name = f"Dr. Bulk Test {random_string()}"
        data = {
            'username': username,
            'password': 'password123',
            'role': 'doctor',
            'name': name,
            'specialty': 'General Dentistry',
            'contact': f'+1 555-000-{1000+i}',
            'email': f'{username}@example.com',
            'licenseNumber': f'BULK{i}{random_string(3)}',
            'experience': str(2 + i),
            'education': 'DDS from Bulk University',
            'status': 'pending_approval'
        }
        print(f"Registering: {username} / {name}")
        r = requests.post('http://127.0.0.1:5000/api/register', json=data)
        print(f"  Status: {r.status_code} | Response: {r.text}")

if __name__ == "__main__":
    bulk_register_doctors(5) 