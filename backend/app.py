from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
from pymysql.cursors import DictCursor

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True) 