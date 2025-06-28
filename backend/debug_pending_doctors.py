import pymysql
from pymysql.cursors import DictCursor

def debug_pending_doctors():
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='V1S21_pass_mysql',
        db='dental_care',
        cursorclass=DictCursor
    )
    
    try:
        with conn.cursor() as cursor:
            print("🔍 Debugging pending doctors issue...")
            
            # Check all doctors
            cursor.execute("SELECT id, name, specialty, status, created_at FROM doctors ORDER BY created_at DESC")
            all_doctors = cursor.fetchall()
            print(f"📊 Total doctors in database: {len(all_doctors)}")
            
            for doctor in all_doctors:
                print(f"  - {doctor['name']} ({doctor['specialty']}) - Status: {doctor['status']} - Created: {doctor['created_at']}")
            
            # Check pending doctors specifically
            cursor.execute("SELECT id, name, specialty, status, created_at FROM doctors WHERE status = 'pending_approval'")
            pending_doctors = cursor.fetchall()
            print(f"\n⏳ Pending doctors: {len(pending_doctors)}")
            
            for doctor in pending_doctors:
                print(f"  - {doctor['name']} ({doctor['specialty']}) - Created: {doctor['created_at']}")
            
            # Check the specific doctor we just registered
            cursor.execute("SELECT id, name, specialty, status, created_at FROM doctors WHERE name = 'Dr. New Test Doctor'")
            new_doctor = cursor.fetchone()
            if new_doctor:
                print(f"\n🔍 Found the new doctor:")
                print(f"  - Name: {new_doctor['name']}")
                print(f"  - Status: {new_doctor['status']}")
                print(f"  - Created: {new_doctor['created_at']}")
            else:
                print("\n❌ New doctor not found in doctors table")
            
            # Check users table for the new doctor
            cursor.execute("SELECT id, username, role, doctor_id FROM users WHERE username = 'dr_newtest'")
            new_user = cursor.fetchone()
            if new_user:
                print(f"\n👤 Found the new user:")
                print(f"  - Username: {new_user['username']}")
                print(f"  - Role: {new_user['role']}")
                print(f"  - Doctor ID: {new_user['doctor_id']}")
            else:
                print("\n❌ New user not found in users table")
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    debug_pending_doctors() 