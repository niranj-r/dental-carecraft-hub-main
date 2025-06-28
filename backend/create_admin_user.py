import pymysql
from pymysql.cursors import DictCursor

def create_admin_user():
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='V1S21_pass_mysql',
        db='dental_care',
        cursorclass=DictCursor
    )
    
    try:
        with conn.cursor() as cursor:
            print("🔧 Creating admin user...")
            
            # First, let's modify the users table to allow 'admin' role
            print("📝 Updating users table to allow admin role...")
            try:
                cursor.execute("ALTER TABLE users MODIFY role ENUM('patient', 'doctor', 'admin')")
                conn.commit()
                print("✅ Users table updated to allow admin role")
            except Exception as e:
                print(f"ℹ️ Users table already supports admin role or error: {str(e)}")
            
            # Check if admin user already exists
            cursor.execute("SELECT id FROM users WHERE username = 'admin'")
            if not cursor.fetchone():
                # Insert admin user
                cursor.execute('''
                    INSERT INTO users (username, password, role) 
                    VALUES (%s, %s, %s)
                ''', ('admin', 'admin123', 'admin'))
                
                conn.commit()
                print("✅ Admin user created successfully!")
                print("   Username: admin")
                print("   Password: admin123")
            else:
                print("ℹ️ Admin user already exists")
            
            # Verify admin user
            cursor.execute("SELECT username, role FROM users WHERE username = 'admin'")
            admin_user = cursor.fetchone()
            if admin_user:
                print(f"✅ Admin user verified: {admin_user['username']} ({admin_user['role']})")
            else:
                print("❌ Admin user not found after creation")
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    create_admin_user() 