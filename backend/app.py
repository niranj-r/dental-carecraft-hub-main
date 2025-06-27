from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import pymysql
from pymysql.cursors import DictCursor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "http://192.168.137.160:8080", "*"]}})

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='root123*',
        db='dental_care',
        cursorclass=DictCursor
    )

@app.route('/api/patients', methods=['GET', 'POST'])
def patients():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if request.method == 'GET':
                cursor.execute('SELECT * FROM patients')
                return jsonify(cursor.fetchall())
            elif request.method == 'POST':
                data = request.get_json()
                required = ['name', 'age', 'gender', 'contact']
                if not data or not all(k in data and data[k] is not None for k in required):
                    return jsonify({'error': 'Missing required fields'}), 400
                try:
                    cursor.execute('INSERT INTO patients (name, age, gender, contact) VALUES (%s, %s, %s, %s)',
                                   (data.get('name'), data.get('age'), data.get('gender'), data.get('contact')))
                    conn.commit()
                    return jsonify({'status': 'success'}), 201
                except Exception as e:
                    conn.rollback()
                    return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM doctors')
            return jsonify(cursor.fetchall())
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing username or password'}), 400
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM users WHERE username=%s AND password=%s', (data['username'], data['password']))
            user = cursor.fetchone()
            if not user:
                return jsonify({'error': 'Invalid credentials'}), 401
            # Return user info except password
            user.pop('password', None)
            return jsonify(user)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/appointments', methods=['GET', 'POST'])
def appointments():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if request.method == 'GET':
                cursor.execute('SELECT * FROM appointments')
                return jsonify(cursor.fetchall())
            elif request.method == 'POST':
                data = request.get_json()
                required = ['patient_id', 'doctor_id', 'date', 'time', 'status']
                if not data or not all(k in data and data[k] is not None for k in required):
                    return jsonify({'error': 'Missing required fields'}), 400
                try:
                    cursor.execute('INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES (%s, %s, %s, %s, %s)',
                                   (data.get('patient_id'), data.get('doctor_id'), data.get('date'), data.get('time'), data.get('status')))
                    conn.commit()
                    return jsonify({'status': 'success'}), 201
                except Exception as e:
                    conn.rollback()
                    return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/payments', methods=['GET', 'POST'])
def payments():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if request.method == 'GET':
                cursor.execute('SELECT * FROM payments')
                return jsonify(cursor.fetchall())
            elif request.method == 'POST':
                data = request.get_json()
                required = ['patient_id', 'amount', 'date', 'status']
                if not data or not all(k in data and data[k] is not None for k in required):
                    return jsonify({'error': 'Missing required fields'}), 400
                try:
                    cursor.execute('INSERT INTO payments (patient_id, amount, date, status) VALUES (%s, %s, %s, %s)',
                                   (data.get('patient_id'), data.get('amount'), data.get('date'), data.get('status')))
                    conn.commit()
                    return jsonify({'status': 'success'}), 201
                except Exception as e:
                    conn.rollback()
                    return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/notifications', methods=['GET', 'POST'])
def notifications():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if request.method == 'GET':
                cursor.execute('SELECT * FROM notifications')
                return jsonify(cursor.fetchall())
            elif request.method == 'POST':
                data = request.get_json()
                required = ['patient_id', 'message', 'date', 'is_read']
                if not data or not all(k in data and data[k] is not None for k in required):
                    return jsonify({'error': 'Missing required fields'}), 400
                try:
                    cursor.execute('INSERT INTO notifications (patient_id, message, date, is_read) VALUES (%s, %s, %s, %s)',
                                   (data.get('patient_id'), data.get('message'), data.get('date'), data.get('is_read')))
                    conn.commit()
                    return jsonify({'status': 'success'}), 201
                except Exception as e:
                    conn.rollback()
                    return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'Backend is working!'})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data or 'role' not in data or 'name' not in data or 'contact' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Check if username exists
            cursor.execute('SELECT id FROM users WHERE username=%s', (data['username'],))
            if cursor.fetchone():
                return jsonify({'error': 'Username already exists'}), 400
            if data['role'] == 'doctor':
                if 'specialty' not in data:
                    return jsonify({'error': 'Missing specialty for doctor'}), 400
                cursor.execute('INSERT INTO doctors (name, specialty, contact) VALUES (%s, %s, %s)',
                               (data['name'], data['specialty'], data['contact']))
                doctor_id = cursor.lastrowid
                cursor.execute('INSERT INTO users (username, password, role, doctor_id) VALUES (%s, %s, %s, %s)',
                               (data['username'], data['password'], 'doctor', doctor_id))
            elif data['role'] == 'patient':
                if 'age' not in data or 'gender' not in data:
                    return jsonify({'error': 'Missing age or gender for patient'}), 400
                cursor.execute('INSERT INTO patients (name, age, gender, contact) VALUES (%s, %s, %s, %s)',
                               (data['name'], data['age'], data['gender'], data['contact']))
                patient_id = cursor.lastrowid
                cursor.execute('INSERT INTO users (username, password, role, patient_id) VALUES (%s, %s, %s, %s)',
                               (data['username'], data['password'], 'patient', patient_id))
            else:
                return jsonify({'error': 'Invalid role'}), 400
            conn.commit()
            return jsonify({'status': 'success'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/init-db', methods=['POST'])
def init_db():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Create tables
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS doctors (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100),
                    specialty VARCHAR(100),
                    contact VARCHAR(50)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS patients (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100),
                    age INT,
                    gender VARCHAR(10),
                    contact VARCHAR(50)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS appointments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    patient_id INT,
                    doctor_id INT,
                    date DATE,
                    time TIME,
                    status VARCHAR(20),
                    FOREIGN KEY (patient_id) REFERENCES patients(id),
                    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS payments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    patient_id INT,
                    amount DECIMAL(10,2),
                    date DATE,
                    status VARCHAR(20),
                    FOREIGN KEY (patient_id) REFERENCES patients(id)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    patient_id INT,
                    message TEXT,
                    date DATETIME,
                    is_read BOOLEAN,
                    FOREIGN KEY (patient_id) REFERENCES patients(id)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE,
                    password VARCHAR(255),
                    role ENUM('patient', 'doctor'),
                    patient_id INT,
                    doctor_id INT,
                    FOREIGN KEY (patient_id) REFERENCES patients(id),
                    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
                )
            ''')
            # Seed doctors
            cursor.execute("INSERT IGNORE INTO doctors (id, name, specialty, contact) VALUES (1, 'Dr. Sarah Smith', 'General Dentistry', '+1 234-567-8901')")
            cursor.execute("INSERT IGNORE INTO doctors (id, name, specialty, contact) VALUES (2, 'Dr. Mike Johnson', 'Orthodontics', '+1 234-567-8902')")
            cursor.execute("INSERT IGNORE INTO doctors (id, name, specialty, contact) VALUES (3, 'Dr. Lisa Brown', 'Oral Surgery', '+1 234-567-8903')")
            # Seed patients
            cursor.execute("INSERT IGNORE INTO patients (id, name, age, gender, contact) VALUES (1, 'Riya Sharma', 28, 'Female', '+1 234-567-8904')")
            cursor.execute("INSERT IGNORE INTO patients (id, name, age, gender, contact) VALUES (2, 'John Doe', 35, 'Male', '+1 234-567-8905')")
            cursor.execute("INSERT IGNORE INTO patients (id, name, age, gender, contact) VALUES (3, 'Sarah Wilson', 42, 'Female', '+1 234-567-8906')")
            # Seed users
            cursor.execute("INSERT IGNORE INTO users (username, password, role, patient_id, doctor_id) VALUES ('riya', 'password123', 'patient', 1, NULL)")
            cursor.execute("INSERT IGNORE INTO users (username, password, role, patient_id, doctor_id) VALUES ('john', 'password123', 'patient', 2, NULL)")
            cursor.execute("INSERT IGNORE INTO users (username, password, role, patient_id, doctor_id) VALUES ('sarah', 'password123', 'patient', 3, NULL)")
            cursor.execute("INSERT IGNORE INTO users (username, password, role, patient_id, doctor_id) VALUES ('drsmith', 'password123', 'doctor', NULL, 1)")
            cursor.execute("INSERT IGNORE INTO users (username, password, role, patient_id, doctor_id) VALUES ('drjohnson', 'password123', 'doctor', NULL, 2)")
            cursor.execute("INSERT IGNORE INTO users (username, password, role, patient_id, doctor_id) VALUES ('drbrown', 'password123', 'doctor', NULL, 3)")
            # Seed appointments
            cursor.execute("INSERT IGNORE INTO appointments (id, patient_id, doctor_id, date, time, status) VALUES (1, 1, 1, '2024-07-01', '09:00:00', 'scheduled')")
            cursor.execute("INSERT IGNORE INTO appointments (id, patient_id, doctor_id, date, time, status) VALUES (2, 2, 2, '2024-07-01', '10:00:00', 'completed')")
            cursor.execute("INSERT IGNORE INTO appointments (id, patient_id, doctor_id, date, time, status) VALUES (3, 3, 3, '2024-07-01', '11:00:00', 'pending')")
            # Seed payments
            cursor.execute("INSERT IGNORE INTO payments (id, patient_id, amount, date, status) VALUES (1, 1, 1500, '2024-07-01', 'paid')")
            cursor.execute("INSERT IGNORE INTO payments (id, patient_id, amount, date, status) VALUES (2, 2, 2000, '2024-07-01', 'paid')")
            cursor.execute("INSERT IGNORE INTO payments (id, patient_id, amount, date, status) VALUES (3, 3, 800, '2024-07-01', 'pending')")
            # Seed notifications
            cursor.execute("INSERT IGNORE INTO notifications (id, patient_id, message, date, is_read) VALUES (1, 1, 'Your appointment is scheduled for 9:00 AM.', NOW(), 0)")
            cursor.execute("INSERT IGNORE INTO notifications (id, patient_id, message, date, is_read) VALUES (2, 2, 'Payment received for your last visit.', NOW(), 1)")
            cursor.execute("INSERT IGNORE INTO notifications (id, patient_id, message, date, is_read) VALUES (3, 3, 'Your next appointment is pending.', NOW(), 0)")
            conn.commit()
        return jsonify({'status': 'initialized'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.errorhandler(422)
def handle_unprocessable_entity(err):
    response = {"error": "Unprocessable Entity", "message": str(err)}
    return make_response(jsonify(response), 422)

if __name__ == '__main__':
    app.run(debug=True) 