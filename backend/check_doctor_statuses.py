import pymysql
from pymysql.cursors import DictCursor

def get_db_connection():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='V1S21_pass_mysql',
            db='dental_care',
            cursorclass=DictCursor
        )
        return connection
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def check_doctor_statuses():
    """Check the status of all doctors in the database"""
    
    print("Checking doctor statuses in database...")
    
    conn = get_db_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return
    
    try:
        with conn.cursor() as cursor:
            cursor.execute('SELECT id, name, specialty, status FROM doctors ORDER BY status, name')
            doctors = cursor.fetchall()
            
            print(f"\nFound {len(doctors)} doctors in database:")
            print("-" * 60)
            
            # Group by status
            status_groups = {}
            for doctor in doctors:
                status = doctor['status']
                if status not in status_groups:
                    status_groups[status] = []
                status_groups[status].append(doctor)
            
            # Display by status
            for status in ['approved', 'pending_approval', 'rejected']:
                if status in status_groups:
                    print(f"\n{status.upper()} DOCTORS ({len(status_groups[status])}):")
                    for doctor in status_groups[status]:
                        print(f"  - Dr. {doctor['name']} ({doctor['specialty']}) - ID: {doctor['id']}")
                else:
                    print(f"\n{status.upper()} DOCTORS: None")
            
            # Summary
            print("\n" + "=" * 60)
            print("SUMMARY:")
            for status, count in [(s, len(status_groups.get(s, []))) for s in ['approved', 'pending_approval', 'rejected']]:
                print(f"  {status}: {count}")
            
            approved_count = len(status_groups.get('approved', []))
            if approved_count == 0:
                print("\n⚠️  WARNING: No approved doctors found!")
                print("   Patients won't be able to book appointments.")
            else:
                print(f"\n✅ {approved_count} approved doctors available for booking")
                
    except Exception as e:
        print(f"❌ Database error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_doctor_statuses() 