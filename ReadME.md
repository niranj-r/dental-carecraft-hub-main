# Dental Management System - Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This document outlines the software requirements for the Dental Management System — a full-stack AI-powered web application designed to streamline dental clinic operations, including appointment scheduling, patient triage, queue tracking, treatment documentation, and billing.

### 1.2 Scope
The system enables Admins, Doctors, and Patients to interact through role-based interfaces. Key features include real-time queue updates, smart scheduling, AI-based symptom intake, SVG-based tooth selection, pre-visit forms, Razorpay/Stripe payment integration, and a gamified dental health score system.

### 1.3 Intended Audience
- Project Developers  
- Hackathon Evaluators  
- Future Clinic Stakeholders  
- Technical and Business Teams

### 1.4 Definitions, Acronyms, and Abbreviations
- JWT: JSON Web Token  
- SVG: Scalable Vector Graphics  
- API: Application Programming Interface  
- SRS: Software Requirements Specification  
- UI/UX: User Interface/User Experience

## 2. Overall Description

### 2.1 Product Perspective
This is a standalone web-based system with modular architecture, designed to work independently of any hospital management software. The backend is a single Flask app (`app.py`), and the frontend is built with React.js.

### 2.2 Product Functions
- User Registration and Role-based Login  
- Appointment Booking and Scheduling  
- AI Chatbot for Symptom Collection  
- Interactive Tooth Selector  
- Queue Tracking (WebSocket or polling)  
- Pre-visit Medical Forms  
- Treatment Recording by Doctors  
- Payment Module Integration  
- Admin Dashboard and Reporting  
- Gamified Dental Health Score

### 2.3 User Classes and Characteristics
- Admin: Manages users, doctors, appointments, reports, and payments.  
- Doctor: Views schedules, adds treatment notes, and accesses patient forms.  
- Patient: Books appointments, fills forms, interacts with chatbot, tracks queue, and completes payments.

### 2.4 Operating Environment
- Web Browsers: Chrome, Edge, Firefox  
- Backend: Python 3.x with Flask  
- Frontend: React.js with TailwindCSS  
- Database: MySQL  
- Deployment: Render, Railway, or any container-based platform

### 2.5 Design and Implementation Constraints
- Single-file backend (`app.py`) as per hackathon constraint  
- Frontend and backend must communicate via REST APIs  
- All role-based authentication must use JWT  
- Payment integration through Razorpay/Stripe sandbox environment

### 2.6 Assumptions and Dependencies
- Users will have access to internet and a browser  
- Payment gateway APIs are functional in test mode  
- Data privacy is enforced via token-based access

## 3. System Features

### 3.1 Authentication Module
- Secure login/register for all roles  
- JWT-based authentication and authorization  
- Passwords are stored with hashing (bcrypt or equivalent)

### 3.2 Appointment Scheduling
- Calendar-based UI for selecting slots  
- Smart conflict prevention logic  
- Waitlist functionality if slots are full

### 3.3 AI Chatbot and Tooth Selector
- Chatbot prompts for symptoms: pain type, duration, triggers  
- Clickable SVG diagram for selecting affected tooth  
- All data is saved and sent with the appointment

### 3.4 Pre-Visit Forms
- Includes medical history, allergy information, and consent  
- Auto-assigned upon successful booking  
- Reviewed by the doctor prior to consultation

### 3.5 Treatment Notes
- Doctors add diagnosis, treatment, and follow-up instructions  
- Records linked to specific appointment ID

### 3.6 Queue Tracker
- Displays real-time position and estimated wait time  
- Polling or WebSocket used for updates

### 3.7 Payment System
- Razorpay/Stripe integration  
- Supports one-time or EMI payments  
- Admin can view and filter payment logs

### 3.8 Gamified Dental Health Score
- Scores increase with regular visits and good form data  
- Reduces with severe treatments or missed visits  
- Displayed visually on patient dashboard

## 4. External Interface Requirements

### 4.1 User Interfaces
- React-based dashboards for each role  
- Mobile-friendly, responsive UI using TailwindCSS  
- Forms and chatbot have progressive input handling

### 4.2 Hardware Interfaces
- Not applicable (Web application)

### 4.3 Software Interfaces
- REST API between frontend and backend  
- Razorpay/Stripe API for payments  
- WebSocket or HTTP polling for queue tracking

### 4.4 Communication Interfaces
- HTTPS for all client-server communication  
- CORS enabled for frontend-backend cross-origin requests

## 5. Non-functional Requirements

### 5.1 Performance Requirements
- The system should handle 50+ concurrent users in real-time  
- Response time < 1 second for queue updates and form submissions

### 5.2 Security Requirements
- JWT-based access control  
- Data encryption in transit (HTTPS)  
- Passwords hashed in database

### 5.3 Usability Requirements
- UI designed for low learning curve  
- Accessible for users with basic tech knowledge

### 5.4 Reliability and Availability
- 99% uptime during clinic hours  
- Error handling and logs available for API failures

## 6. Appendix

### 6.1 Database Models
- users(id, name, email, password, role)  
- appointments(id, patient_id, doctor_id, date, time, tooth_id, symptoms, notes, status)  
- treatment_notes(id, appointment_id, diagnosis, treatment, follow_up_in_days)  
- payments(id, appointment_id, amount, method, status, plan_type)  
- dental_scores(id, patient_id, score)  
- waitlist(id, patient_id, doctor_id, preferred_date, time_range)

### 6.2 Future Enhancements
- AI-based treatment recommendations  
- Multilingual support for chatbot  
- Insurance API integration  
- SMS/email reminders and feedback surveys
