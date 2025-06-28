from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import pymysql
from pymysql.cursors import DictCursor
from datetime import timedelta, time as dtime, datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:8080", "http://192.168.137.160:8080", "*"]}})

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='V1S21_pass_mysql',
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
            # Check if admin access is requested
            admin_access = request.args.get('admin', 'false').lower() == 'true'
            
            if admin_access:
                # Return all doctors for admin access
                cursor.execute('SELECT * FROM doctors')
            else:
                # Only return approved doctors for appointment booking
                cursor.execute('SELECT * FROM doctors WHERE status = %s', ('approved',))
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
            
            # Check if user is a doctor and verify approval status
            if user['role'] == 'doctor':
                cursor.execute('SELECT status FROM doctors WHERE id=%s', (user['doctor_id'],))
                doctor = cursor.fetchone()
                if not doctor:
                    return jsonify({'error': 'Doctor profile not found'}), 404
                
                if doctor['status'] == 'pending_approval':
                    return jsonify({'error': 'Your account is pending admin approval. Please wait for approval.'}), 403
                elif doctor['status'] == 'rejected':
                    return jsonify({'error': 'Your account has been rejected. Please contact administrator.'}), 403
            
            user.pop('password', None)
            return jsonify(user)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/appointments', methods=['GET', 'POST'])
def appointments():
    print('--- /api/appointments called ---')
    print('Method:', request.method)
    print('Headers:', dict(request.headers))
    if request.method == 'POST':
        print('Body:', request.get_data(as_text=True))
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if request.method == 'GET':
                patient_id = request.args.get('patient_id')
                if patient_id:
                    cursor.execute('''
                        SELECT a.*, d.name as doctor_name 
                        FROM appointments a 
                        LEFT JOIN doctors d ON a.doctor_id = d.id 
                        WHERE a.patient_id=%s
                    ''', (patient_id,))
                else:
                    cursor.execute('''
                        SELECT a.*, d.name as doctor_name 
                        FROM appointments a 
                        LEFT JOIN doctors d ON a.doctor_id = d.id
                    ''')
                results = cursor.fetchall()
                print('Fetched appointments:', results)
                for row in results:
                    for k, v in row.items():
                        print(f'Key: {k}, Value: {v}, Type: {type(v)}')
                        if isinstance(v, (timedelta, dtime)):
                            row[k] = str(v)
                print('Serialized appointments:', results)
                return jsonify(results)
            elif request.method == 'POST':
                data = request.get_json()
                print('Received appointment POST data:', data)
                required = ['patient_id', 'doctor_id', 'date', 'time', 'status']
                if not data or not all(k in data and data[k] is not None for k in required):
                    print('Missing required fields:', data)
                    return jsonify({'error': 'Missing required fields'}), 400
                try:
                    cursor.execute('INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES (%s, %s, %s, %s, %s)',
                                   (data.get('patient_id'), data.get('doctor_id'), data.get('date'), data.get('time'), data.get('status')))
                    conn.commit()
                    print('Appointment inserted successfully.')
                    return jsonify({'status': 'success'}), 201
                except Exception as e:
                    conn.rollback()
                    print('Error inserting appointment:', str(e))
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
                patient_id = request.args.get('patient_id')
                if patient_id:
                    cursor.execute('SELECT * FROM payments WHERE patient_id=%s', (patient_id,))
                else:
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
    required = ['username', 'password', 'role', 'name', 'contact']
    if not data or not all(k in data and data[k] for k in required):
        print('❌ Missing required fields:', data)
        return jsonify({'error': 'Missing required fields'}), 400
    
    print(f"[REGISTER] Attempt: {data.get('username')} as {data.get('role')} at {datetime.now()}")
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('SELECT id FROM users WHERE username=%s', (data['username'],))
            if cursor.fetchone():
                print(f"❌ Username already exists: {data['username']}")
                return jsonify({'error': 'Username already exists'}), 400
            
            if data['role'] == 'doctor':
                if 'specialty' not in data:
                    print('❌ Missing specialty for doctor:', data)
                    return jsonify({'error': 'Missing specialty for doctor'}), 400
                email = data.get('email', '')
                license_number = data.get('licenseNumber', '')
                experience = data.get('experience', 0)
                education = data.get('education', '')
                status = data.get('status', 'pending_approval')
                print(f"[REGISTER] Inserting doctor: {data['name']} with status {status}")
                cursor.execute('''
                    INSERT INTO doctors (name, specialty, contact, email, license_number, experience, education, status, rejection_reason, created_at) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ''', (data['name'], data['specialty'], data['contact'], email, license_number, experience, education, status, None))
                doctor_id = cursor.lastrowid
                print(f"[REGISTER] Doctor inserted with ID: {doctor_id}")
                cursor.execute('INSERT INTO users (username, password, role, doctor_id) VALUES (%s, %s, %s, %s)',
                               (data['username'], data['password'], 'doctor', doctor_id))
                print(f"[REGISTER] User inserted for doctor: {data['username']}")
                conn.commit()
                print(f"[REGISTER] Doctor registration successful: {data['username']} (ID: {doctor_id})")
                return jsonify({
                    'status': 'success', 
                    'message': 'Registration submitted successfully. Your account is pending admin approval.',
                    'requires_approval': True
                }), 201
            elif data['role'] == 'patient':
                if 'age' not in data or 'gender' not in data:
                    print('❌ Missing age or gender for patient:', data)
                    return jsonify({'error': 'Missing age or gender for patient'}), 400
                cursor.execute('INSERT INTO patients (name, age, gender, contact) VALUES (%s, %s, %s, %s)',
                               (data['name'], data['age'], data['gender'], data['contact']))
                patient_id = cursor.lastrowid
                cursor.execute('INSERT INTO users (username, password, role, patient_id) VALUES (%s, %s, %s, %s)',
                               (data['username'], data['password'], 'patient', patient_id))
                conn.commit()
                print(f"[REGISTER] Patient registration successful: {data['username']} (ID: {patient_id})")
                return jsonify({'status': 'success'}), 201
            else:
                print('❌ Invalid role:', data)
                return jsonify({'error': 'Invalid role'}), 400
    except Exception as e:
        conn.rollback()
        print(f"❌ Registration error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/init-db', methods=['POST'])
def init_db():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Drop existing tables in reverse order to handle foreign keys
            cursor.execute('DROP TABLE IF EXISTS users')
            cursor.execute('DROP TABLE IF EXISTS notifications')
            cursor.execute('DROP TABLE IF EXISTS payments')
            cursor.execute('DROP TABLE IF EXISTS appointments')
            cursor.execute('DROP TABLE IF EXISTS doctors')
            cursor.execute('DROP TABLE IF EXISTS patients')
            cursor.execute('DROP TABLE IF EXISTS treatment_notes')
            
            # Create tables with updated schema
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS doctors (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100),
                    specialty VARCHAR(100),
                    contact VARCHAR(50),
                    email VARCHAR(100),
                    license_number VARCHAR(50),
                    experience INT DEFAULT 0,
                    education TEXT,
                    status ENUM('pending_approval', 'approved', 'rejected') DEFAULT 'pending_approval',
                    rejection_reason TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
            # Seed doctors with updated schema
            cursor.execute("INSERT IGNORE INTO doctors (id, name, specialty, contact, email, license_number, experience, education, status) VALUES (1, 'Dr. Sarah Smith', 'General Dentistry', '+1 234-567-8901', 'drsmith@dentalcare.com', 'MD123456', 8, 'DDS from Harvard Dental School', 'approved')")
            cursor.execute("INSERT IGNORE INTO doctors (id, name, specialty, contact, email, license_number, experience, education, status) VALUES (2, 'Dr. Mike Johnson', 'Orthodontics', '+1 234-567-8902', 'drjohnson@dentalcare.com', 'MD789012', 12, 'DDS from Stanford Dental School, Orthodontics Residency', 'approved')")
            cursor.execute("INSERT IGNORE INTO doctors (id, name, specialty, contact, email, license_number, experience, education, status) VALUES (3, 'Dr. Lisa Brown', 'Oral Surgery', '+1 234-567-8903', 'drbrown@dentalcare.com', 'MD345678', 15, 'DDS from UCLA Dental School, Oral Surgery Fellowship', 'approved')")
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

@app.route('/api/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM patients WHERE id=%s', (patient_id,))
            patient = cursor.fetchone()
            if not patient:
                return jsonify({'error': 'Patient not found'}), 404
            return jsonify(patient)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/chairs', methods=['GET'])
def get_chairs():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM chairs')
            return jsonify(cursor.fetchall())
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/appointments/optimize', methods=['POST'])
def optimize_appointments():
    data = request.get_json()
    if not data or 'appointments' not in data:
        return jsonify({'error': 'Missing appointments data'}), 400
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            for appointment in data['appointments']:
                cursor.execute('''
                    UPDATE appointments 
                    SET chair_id=%s, time=%s, status=%s 
                    WHERE id=%s
                ''', (appointment['chair_id'], appointment['time'], appointment['status'], appointment['id']))
            conn.commit()
            return jsonify({'status': 'success', 'message': 'Schedule optimized successfully'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/appointments/emergency', methods=['POST'])
def create_emergency_slot():
    data = request.get_json()
    required = ['patient_id', 'doctor_id', 'date', 'time', 'priority']
    if not data or not all(k in data and data[k] for k in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Find available chair
            cursor.execute('SELECT id FROM chairs WHERE status="available" LIMIT 1')
            chair = cursor.fetchone()
            if not chair:
                return jsonify({'error': 'No available chairs'}), 400
            
            # Create emergency appointment
            cursor.execute('''
                INSERT INTO appointments (patient_id, doctor_id, date, time, status, priority, chair_id, type)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ''', (data['patient_id'], data['doctor_id'], data['date'], data['time'], 
                  'scheduled', data['priority'], chair['id'], 'Emergency'))
            conn.commit()
            return jsonify({'status': 'success', 'message': 'Emergency slot created'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/notifications/smart', methods=['GET', 'POST'])
def smart_notifications():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if request.method == 'GET':
                patient_id = request.args.get('patient_id')
                if patient_id:
                    cursor.execute('SELECT * FROM smart_notifications WHERE patient_id=%s ORDER BY timestamp DESC', (patient_id,))
                else:
                    cursor.execute('SELECT * FROM smart_notifications ORDER BY timestamp DESC')
                return jsonify(cursor.fetchall())
            elif request.method == 'POST':
                data = request.get_json()
                required = ['patient_id', 'type', 'title', 'message']
                if not data or not all(k in data and data[k] for k in required):
                    return jsonify({'error': 'Missing required fields'}), 400
                
                cursor.execute('''
                    INSERT INTO smart_notifications (patient_id, type, title, message, timestamp, read, action_required)
                    VALUES (%s, %s, %s, %s, NOW(), %s, %s)
                ''', (data['patient_id'], data['type'], data['title'], data['message'], 
                      data.get('read', False), data.get('action_required', False)))
                conn.commit()
                return jsonify({'status': 'success'}), 201
    except Exception as e:
        if request.method == 'POST':
            conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/analytics/productivity', methods=['GET'])
def get_productivity_analytics():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Calculate chair utilization
            cursor.execute('''
                SELECT 
                    c.id, c.name, c.status,
                    COUNT(a.id) as appointment_count,
                    (COUNT(a.id) * 100.0 / 8) as utilization_rate
                FROM chairs c
                LEFT JOIN appointments a ON c.id = a.chair_id AND a.date = CURDATE()
                GROUP BY c.id, c.name, c.status
            ''')
            chair_analytics = cursor.fetchall()
            
            # Calculate doctor productivity
            cursor.execute('''
                SELECT 
                    d.id, d.name, d.specialty,
                    COUNT(a.id) as appointment_count,
                    (COUNT(a.id) * 100.0 / 10) as productivity_score
                FROM doctors d
                LEFT JOIN appointments a ON d.id = a.doctor_id AND a.date = CURDATE()
                GROUP BY d.id, d.name, d.specialty
            ''')
            doctor_analytics = cursor.fetchall()
            
            return jsonify({
                'chair_utilization': chair_analytics,
                'doctor_productivity': doctor_analytics
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/doctors/pending', methods=['GET'])
def get_pending_doctors():
    """Get doctors pending approval - Admin only endpoint"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('''
                SELECT d.*, u.username 
                FROM doctors d 
                LEFT JOIN users u ON d.id = u.doctor_id 
                WHERE d.status = 'pending_approval'
                ORDER BY d.created_at DESC
            ''')
            doctors = cursor.fetchall()
            
            # Handle case where username might be None
            for doctor in doctors:
                if doctor['username'] is None:
                    doctor['username'] = 'Unknown'
                    
            return jsonify(doctors)
    except Exception as e:
        print(f"Error fetching pending doctors: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/doctors/<int:doctor_id>/approve', methods=['POST'])
def approve_doctor(doctor_id):
    """Approve a doctor - Admin only endpoint"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('UPDATE doctors SET status = "approved" WHERE id = %s', (doctor_id,))
            if cursor.rowcount == 0:
                return jsonify({'error': 'Doctor not found'}), 404
            conn.commit()
            return jsonify({'status': 'success', 'message': 'Doctor approved successfully'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/doctors/<int:doctor_id>/reject', methods=['POST'])
def reject_doctor(doctor_id):
    """Reject a doctor - Admin only endpoint"""
    data = request.get_json()
    reason = data.get('reason', 'No reason provided')
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('UPDATE doctors SET status = "rejected", rejection_reason = %s WHERE id = %s', (reason, doctor_id))
            if cursor.rowcount == 0:
                return jsonify({'error': 'Doctor not found'}), 404
            conn.commit()
            return jsonify({'status': 'success', 'message': 'Doctor rejected successfully'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/test-registration', methods=['POST'])
def test_registration():
    """Test endpoint to verify registration system"""
    data = request.get_json()
    return jsonify({
        'status': 'success',
        'message': 'Registration endpoint is working',
        'received_data': data
    })

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint - separate from regular login for security"""
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing username or password'}), 400
    
    # Security: Log admin login attempt
    print(f"Admin login attempt: {data.get('username')} at {datetime.now()}")
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Check for admin credentials in database
            cursor.execute('SELECT * FROM users WHERE username = %s AND password = %s AND role = "admin"', 
                         (data['username'], data['password']))
            admin_user = cursor.fetchone()
            
            if admin_user:
                # Log successful admin login
                print(f"Admin login successful: {data['username']} at {datetime.now()}")
                
                admin_response = {
                    'id': admin_user['id'],
                    'username': admin_user['username'],
                    'role': admin_user['role'],
                    'name': 'System Administrator',
                    'loginTime': datetime.now().isoformat()
                }
                
                return jsonify(admin_response)
            else:
                # Log failed admin login attempt
                print(f"Failed admin login attempt: {data['username']} at {datetime.now()}")
                return jsonify({'error': 'Invalid admin credentials'}), 401
                
    except Exception as e:
        print(f"Admin login error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/doctors/profile', methods=['GET'])
def get_doctor_profile():
    """Get the profile of the logged-in doctor"""
    # Get doctor_id from query parameter or session
    doctor_id = request.args.get('doctor_id')
    if not doctor_id:
        return jsonify({'error': 'Doctor ID required'}), 400
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('''
                SELECT d.*, u.username 
                FROM doctors d 
                JOIN users u ON d.id = u.doctor_id 
                WHERE d.id = %s
            ''', (doctor_id,))
            doctor = cursor.fetchone()
            
            if not doctor:
                return jsonify({'error': 'Doctor not found'}), 404
            
            return jsonify(doctor)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/doctors/<int:doctor_id>/appointments', methods=['GET'])
def get_doctor_appointments(doctor_id):
    """Get appointments for a specific doctor"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('''
                SELECT a.*, p.name as patient_name, p.age, p.gender, p.contact as patient_contact
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                WHERE a.doctor_id = %s
                ORDER BY a.date DESC, a.time ASC
            ''', (doctor_id,))
            appointments = cursor.fetchall()
            
            # Convert datetime objects to strings
            for appointment in appointments:
                if appointment.get('date'):
                    appointment['date'] = appointment['date'].strftime('%Y-%m-%d')
                if appointment.get('time'):
                    appointment['time'] = str(appointment['time'])
            
            return jsonify(appointments)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/doctors/<int:doctor_id>/appointments/today', methods=['GET'])
def get_doctor_today_appointments(doctor_id):
    """Get today's appointments for a specific doctor"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('''
                SELECT a.*, p.name as patient_name, p.age, p.gender, p.contact as patient_contact
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                WHERE a.doctor_id = %s AND a.date = CURDATE()
                ORDER BY a.time ASC
            ''', (doctor_id,))
            appointments = cursor.fetchall()
            
            # Convert datetime objects to strings
            for appointment in appointments:
                if appointment.get('date'):
                    appointment['date'] = appointment['date'].strftime('%Y-%m-%d')
                if appointment.get('time'):
                    appointment['time'] = str(appointment['time'])
            
            return jsonify(appointments)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/treatment-notes', methods=['GET', 'POST'])
def treatment_notes():
    """Handle treatment notes for patients"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if request.method == 'GET':
                doctor_id = request.args.get('doctor_id')
                patient_id = request.args.get('patient_id')
                try:
                    # Check if table exists
                    cursor.execute("SHOW TABLES LIKE 'treatment_notes'")
                    if not cursor.fetchone():
                        print('ERROR: treatment_notes table does not exist!')
                        return jsonify({'error': 'treatment_notes table does not exist'}), 500
                    if doctor_id:
                        cursor.execute('''
                            SELECT tn.*, p.name as patient_name, d.name as doctor_name
                            FROM treatment_notes tn
                            JOIN patients p ON tn.patient_id = p.id
                            JOIN doctors d ON tn.doctor_id = d.id
                            WHERE tn.doctor_id = %s
                            ORDER BY tn.created_at DESC
                        ''', (doctor_id,))
                    elif patient_id:
                        cursor.execute('''
                            SELECT tn.*, p.name as patient_name, d.name as doctor_name
                            FROM treatment_notes tn
                            JOIN patients p ON tn.patient_id = p.id
                            JOIN doctors d ON tn.doctor_id = d.id
                            WHERE tn.patient_id = %s
                            ORDER BY tn.created_at DESC
                        ''', (patient_id,))
                    else:
                        cursor.execute('''
                            SELECT tn.*, p.name as patient_name, d.name as doctor_name
                            FROM treatment_notes tn
                            JOIN patients p ON tn.patient_id = p.id
                            JOIN doctors d ON tn.doctor_id = d.id
                            ORDER BY tn.created_at DESC
                        ''')
                    notes = cursor.fetchall()
                    for note in notes:
                        if note.get('created_at'):
                            note['created_at'] = note['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                    return jsonify(notes)
                except Exception as e:
                    print('Error in GET /api/treatment-notes:', str(e))
                    import traceback; traceback.print_exc()
                    return jsonify({'error': str(e)}), 500
            elif request.method == 'POST':
                data = request.get_json()
                required = ['doctor_id', 'patient_id', 'diagnosis', 'treatment_plan', 'notes']
                if not data or not all(k in data and data[k] for k in required):
                    return jsonify({'error': 'Missing required fields'}), 400
                try:
                    cursor.execute('''
                        INSERT INTO treatment_notes (doctor_id, patient_id, diagnosis, treatment_plan, notes, created_at)
                        VALUES (%s, %s, %s, %s, %s, NOW())
                    ''', (data['doctor_id'], data['patient_id'], data['diagnosis'], data['treatment_plan'], data['notes']))
                    conn.commit()
                    return jsonify({'status': 'success', 'id': cursor.lastrowid}), 201
                except Exception as e:
                    print('Error in POST /api/treatment-notes:', str(e))
                    import traceback; traceback.print_exc()
                    return jsonify({'error': str(e)}), 500
    except Exception as e:
        print('General error in /api/treatment-notes:', str(e))
        import traceback; traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/appointments/<int:appointment_id>/status', methods=['PUT'])
def update_appointment_status(appointment_id):
    """Update appointment status"""
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('UPDATE appointments SET status = %s WHERE id = %s', (data['status'], appointment_id))
            conn.commit()
            
            if cursor.rowcount == 0:
                return jsonify({'error': 'Appointment not found'}), 404
            
            return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/doctors/<int:doctor_id>/patients', methods=['GET'])
def get_doctor_patients(doctor_id):
    """Get all patients for a specific doctor"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('''
                SELECT DISTINCT p.*, 
                       COUNT(a.id) as appointment_count,
                       MAX(a.date) as last_appointment
                FROM patients p
                JOIN appointments a ON p.id = a.patient_id
                WHERE a.doctor_id = %s
                GROUP BY p.id
                ORDER BY p.name
            ''', (doctor_id,))
            patients = cursor.fetchall()
            
            for patient in patients:
                if patient.get('last_appointment'):
                    patient['last_appointment'] = patient['last_appointment'].strftime('%Y-%m-%d')
            
            return jsonify(patients)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/doctors/<int:doctor_id>/stats', methods=['GET'])
def get_doctor_stats(doctor_id):
    """Get statistics for a specific doctor"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Today's appointments
            cursor.execute('''
                SELECT COUNT(*) as today_appointments,
                       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                       SUM(CASE WHEN status = 'urgent' THEN 1 ELSE 0 END) as urgent
                FROM appointments 
                WHERE doctor_id = %s AND date = CURDATE()
            ''', (doctor_id,))
            today_stats = cursor.fetchone()
            
            # Total patients
            cursor.execute('''
                SELECT COUNT(DISTINCT patient_id) as total_patients
                FROM appointments 
                WHERE doctor_id = %s
            ''', (doctor_id,))
            patient_stats = cursor.fetchone()
            
            # Monthly appointments
            cursor.execute('''
                SELECT COUNT(*) as monthly_appointments
                FROM appointments 
                WHERE doctor_id = %s AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())
            ''', (doctor_id,))
            monthly_stats = cursor.fetchone()
            
            stats = {
                'today': today_stats,
                'patients': patient_stats,
                'monthly': monthly_stats
            }
            
            return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.errorhandler(422)
def handle_unprocessable_entity(err):
    response = {"error": "Unprocessable Entity", "message": str(err)}
    return make_response(jsonify(response), 422)

if __name__ == '__main__':
    app.run(debug=True) 