import pymysql
from pymysql.cursors import DictCursor

def test_pending_doctors():
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='V1S21_pass_mysql',
        db='dental_care',
        cursorclass=DictCursor
    )
    
    try:
        with conn.cursor() as cursor:
            print("🔍 Checking current doctors in database...")
            
            # Check all doctors
            cursor.execute("SELECT id, name, specialty, status, created_at FROM doctors")
            all_doctors = cursor.fetchall()
            print(f"📊 Total doctors in database: {len(all_doctors)}")
            
            for doctor in all_doctors:
                print(f"  - {doctor['name']} ({doctor['specialty']}) - Status: {doctor['status']}")
            
            # Check pending doctors specifically
            cursor.execute("SELECT id, name, specialty, status, created_at FROM doctors WHERE status = 'pending_approval'")
            pending_doctors = cursor.fetchall()
            print(f"\n⏳ Pending doctors: {len(pending_doctors)}")
            
            for doctor in pending_doctors:
                print(f"  - {doctor['name']} ({doctor['specialty']}) - Created: {doctor['created_at']}")
            
            # Add a test pending doctor if none exist
            if len(pending_doctors) == 0:
                print("\n📝 Adding a test pending doctor...")
                
                # First check if test doctor already exists
                cursor.execute("SELECT id FROM doctors WHERE name = 'Dr. Test Pending'")
                if not cursor.fetchone():
                    # Insert test doctor
                    cursor.execute('''
                        INSERT INTO doctors (name, specialty, contact, email, license_number, experience, education, status, created_at) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    ''', ('Dr. Test Pending', 'Test Specialty', '+1 555-123-4567', 'test@example.com', 'TEST123', 5, 'Test University', 'pending_approval'))
                    
                    doctor_id = cursor.lastrowid
                    
                    # Add corresponding user
                    cursor.execute('''
                        INSERT INTO users (username, password, role, doctor_id) 
                        VALUES (%s, %s, %s, %s)
                    ''', ('testdoctor', 'password123', 'doctor', doctor_id))
                    
                    conn.commit()
                    print(f"✅ Test doctor added with ID: {doctor_id}")
                else:
                    print("ℹ️ Test doctor already exists")
            
            # Check pending doctors again
            cursor.execute("SELECT id, name, specialty, status, created_at FROM doctors WHERE status = 'pending_approval'")
            pending_doctors = cursor.fetchall()
            print(f"\n⏳ Pending doctors after test: {len(pending_doctors)}")
            
            for doctor in pending_doctors:
                print(f"  - {doctor['name']} ({doctor['specialty']}) - Created: {doctor['created_at']}")
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    test_pending_doctors() 