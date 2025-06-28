import pymysql
from pymysql.cursors import DictCursor

def list_all_doctors():
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='V1S21_pass_mysql',
        db='dental_care',
        cursorclass=DictCursor
    )
    try:
        with conn.cursor() as cursor:
            cursor.execute('''
                SELECT d.id, d.name, d.specialty, d.status, d.created_at, u.username
                FROM doctors d
                LEFT JOIN users u ON d.id = u.doctor_id
                ORDER BY d.created_at DESC
            ''')
            doctors = cursor.fetchall()
            print(f"Total doctors: {len(doctors)}")
            for doc in doctors:
                print(f"- {doc['name']} | Username: {doc['username']} | Status: {doc['status']} | Created: {doc['created_at']}")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    list_all_doctors() 