import pymysql
from pymysql.cursors import DictCursor

def create_treatment_notes_table():
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='V1S21_pass_mysql',
        db='dental_care',
        cursorclass=DictCursor
    )
    
    try:
        with conn.cursor() as cursor:
            print("🔧 Creating treatment_notes table...")
            
            # Create treatment_notes table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS treatment_notes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    doctor_id INT,
                    patient_id INT,
                    diagnosis TEXT,
                    treatment_plan TEXT,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
                    FOREIGN KEY (patient_id) REFERENCES patients(id)
                )
            ''')
            conn.commit()
            print("✅ treatment_notes table created successfully!")
            
            # Verify the table exists
            cursor.execute("SHOW TABLES LIKE 'treatment_notes'")
            if cursor.fetchone():
                print("✅ Table verification successful!")
            else:
                print("❌ Table verification failed!")
            
            # Check if table has any data
            cursor.execute("SELECT COUNT(*) as count FROM treatment_notes")
            result = cursor.fetchone()
            count = result['count'] if result else 0
            print(f"📊 Current records in treatment_notes: {count}")
            
            # Add sample data if table is empty
            if count == 0:
                print("📝 Adding sample treatment notes...")
                cursor.execute('''
                    INSERT INTO treatment_notes (doctor_id, patient_id, diagnosis, treatment_plan, notes)
                    VALUES 
                    (1, 1, 'Cavity in upper right molar', 'Fill the cavity with composite material', 'Patient reported sensitivity to cold. No pain during examination.'),
                    (2, 2, 'Misaligned teeth', 'Braces treatment for 18 months', 'Patient wants to improve smile. Recommended Invisalign or traditional braces.'),
                    (3, 3, 'Wisdom tooth extraction needed', 'Surgical extraction of impacted wisdom tooth', 'Tooth is impacted and causing pain. Surgery scheduled for next week.')
                ''')
                conn.commit()
                print("✅ Sample treatment notes added!")
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    create_treatment_notes_table() 