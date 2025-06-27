CREATE DATABASE IF NOT EXISTS dental_care;
USE dental_care;

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    gender VARCHAR(10),
    contact VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    specialty VARCHAR(100),
    contact VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    date DATE,
    time TIME,
    status VARCHAR(20),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    amount DECIMAL(10,2),
    date DATE,
    status VARCHAR(20),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    message TEXT,
    date DATETIME,
    is_read BOOLEAN,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('patient', 'doctor'),
    patient_id INT,
    doctor_id INT,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Sample doctors
INSERT INTO doctors (name, specialty, contact) VALUES
('Dr. Sarah Smith', 'General Dentistry', '+1 234-567-8901'),
('Dr. Mike Johnson', 'Orthodontics', '+1 234-567-8902'),
('Dr. Lisa Brown', 'Oral Surgery', '+1 234-567-8903');

-- Sample patients
INSERT INTO patients (name, age, gender, contact) VALUES
('Riya Sharma', 28, 'Female', '+1 234-567-8904'),
('John Doe', 35, 'Male', '+1 234-567-8905'),
('Sarah Wilson', 42, 'Female', '+1 234-567-8906');

-- Sample appointments (with time slots)
INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES
(1, 1, '2024-07-01', '09:00:00', 'scheduled'),
(2, 2, '2024-07-01', '10:00:00', 'completed'),
(3, 3, '2024-07-01', '11:00:00', 'pending');

-- Sample payments
INSERT INTO payments (patient_id, amount, date, status) VALUES
(1, 1500, '2024-07-01', 'paid'),
(2, 2000, '2024-07-01', 'paid'),
(3, 800, '2024-07-01', 'pending');

-- Sample notifications
INSERT INTO notifications (patient_id, message, date, is_read) VALUES
(1, 'Your appointment is scheduled for 9:00 AM.', NOW(), 0),
(2, 'Payment received for your last visit.', NOW(), 1),
(3, 'Your next appointment is pending.', NOW(), 0);

-- Sample users (passwords are plain text for demo; use hashing in production)
INSERT INTO users (username, password, role, patient_id, doctor_id) VALUES
('riya', 'password123', 'patient', 1, NULL),
('john', 'password123', 'patient', 2, NULL),
('sarah', 'password123', 'patient', 3, NULL),
('drsmith', 'password123', 'doctor', NULL, 1),
('drjohnson', 'password123', 'doctor', NULL, 2),
('drbrown', 'password123', 'doctor', NULL, 3); 