#!/usr/bin/env python3
"""
Script to add test appointments for today
"""

import mysql.connector
from datetime import datetime, timedelta
import sys
import os

# Add the current directory to the path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='dental_care',
        autocommit=True
    )

def add_test_appointments():
    # Database connection
    conn = get_db_connection()
    
    try:
        with conn.cursor(dictionary=True) as cursor:
            # Get today's date
            today = datetime.now().strftime('%Y-%m-%d')
            
            # Check if appointments already exist for today
            cursor.execute('SELECT COUNT(*) as count FROM appointments WHERE date = %s', (today,))
            result = cursor.fetchone()
            existing_count = result['count'] if result else 0
            
            if existing_count > 0:
                print(f"Appointments already exist for today ({today}). Skipping...")
                return
            
            # Add some test appointments for today
            test_appointments = [
                (1, 1, today, '09:00:00', 'pending'),  # Riya Sharma with Dr. Sarah Smith
                (2, 1, today, '10:30:00', 'completed'),  # John Doe with Dr. Sarah Smith
                (3, 1, today, '14:00:00', 'urgent'),  # Sarah Wilson with Dr. Sarah Smith
            ]
            
            for patient_id, doctor_id, date, time, status in test_appointments:
                cursor.execute('''
                    INSERT INTO appointments (patient_id, doctor_id, date, time, status)
                    VALUES (%s, %s, %s, %s, %s)
                ''', (patient_id, doctor_id, date, time, status))
            
            print(f"Added {len(test_appointments)} test appointments for today ({today})")
            
            # Show the appointments
            cursor.execute('''
                SELECT a.*, p.name as patient_name, d.name as doctor_name
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                JOIN doctors d ON a.doctor_id = d.id
                WHERE a.date = %s
                ORDER BY a.time
            ''', (today,))
            
            appointments = cursor.fetchall()
            print("\nToday's appointments:")
            for appt in appointments:
                print(f"- {appt['time']}: {appt['patient_name']} with {appt['doctor_name']} ({appt['status']})")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_test_appointments() 