# CareCraft - Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
Specify the functional and non-functional requirements for CareCraft, a full-stack web application designed to streamline operations in dental clinics through AI-assisted appointment management, patient intake, treatment recording, billing, and analytics.

### 1.2 Scope
The product enables authorized users to manage organizational entities (admin, doctors, patients), handle appointment bookings with real-time queue tracking, collect symptom data via chatbot, visualize dental issues with an SVG-based tooth selector, and process secure online payments. Role-Based Access Control (RBAC) ensures each user only accesses relevant features.

### 1.3 Stakeholders

| Stakeholder          | Interest                                                   |
|----------------------|------------------------------------------------------------|
| Clinic Admin         | Manages staff, appointments, reports, and payments         |
| Doctors              | View schedule, access patient info, record treatment       |
| Patients             | Book appointments, submit forms, track queue, make payment|
| IT/Deployment Team   | Deployment, performance, maintenance                       |
| Developers           | Ensure code quality, scalability, and security             |

### 1.4 Definitions & Abbreviations

| Term       | Meaning                                                                   |
|------------|---------------------------------------------------------------------------|
| JWT        | JSON Web Token, used for secure role-based authentication                |
| SVG        | Scalable Vector Graphics used in the tooth diagram                        |
| RBAC       | Role-Based Access Control                                                 |
| EMI        | Equated Monthly Installment for subscription payments                    |
| UHI        | Unique Health Identifier                                                  |

## 2. Overall Description

### 2.1 Product Perspective
A responsive, multi-tenant web-based application with a React frontend and Flask backend (single app.py). APIs expose core functionality, allowing for future integrations.

### 2.2 User Classes & Characteristics

| Class            | Key Permissions                                                                 |
|------------------|----------------------------------------------------------------------------------|
| Admin            | Manage users, appointments, payments, system reports                            |
| Doctor           | View appointments, patient info, and submit treatment notes                     |
| Patient          | Book/view appointments, submit pre-visit forms, chatbot intake, make payments   |

### 2.3 Product Functions (High-Level)
- User Registration & JWT Authentication
- Role-Based Dashboard Access
- Smart Appointment Booking & Conflict Detection
- AI Chatbot for Symptom Collection
- SVG-Based Tooth Selector
- Queue Tracking (WebSocket or polling)
- Pre-Visit Medical Forms
- Treatment Note Recording
- Razorpay Payment Integration
- Admin Analytics & Report Export

### 2.4 Assumptions & Dependencies
- Users will access the platform via a web browser.
- Backend hosted with CORS & HTTPS enabled.
- Payment gateways (Razorpay) operate in test/live mode.

## 3. Functional Requirements

### 3.1 Authentication & Access Control
| ID         | Requirement                                                                                       |
|------------|---------------------------------------------------------------------------------------------------|
| FR-AUTH-01 | System shall allow secure user registration and login with JWT authentication                    |
| FR-AUTH-02 | RBAC ensures users can only access dashboards relevant to their role                             |
| FR-AUTH-03 | Passwords shall be hashed using industry-standard algorithms                                     |

### 3.2 Appointment Management
| ID         | Requirement                                                                                       |
|------------|---------------------------------------------------------------------------------------------------|
| FR-APPT-01 | Patients shall view doctors' availability and book slots                                          |
| FR-APPT-02 | System prevents double-booking and displays idle slots preferentially                            |
| FR-APPT-03 | Admins and patients may reschedule with conflict checks                                           |
| FR-APPT-04 | If no slots are available, patients may join a waitlist                                           |

### 3.3 AI Chatbot & Tooth Selector
| ID         | Requirement                                                                                       |
|------------|---------------------------------------------------------------------------------------------------|
| FR-AI-01   | Patients interact with a chatbot to submit symptom details                                        |
| FR-AI-02   | SVG-based interface allows patients to indicate affected tooth                                    |

### 3.4 Pre-Visit Forms
| ID         | Requirement                                                                                       |
|------------|---------------------------------------------------------------------------------------------------|
| FR-FORM-01 | System sends pre-visit forms (medical history, allergies, consent) post-booking                  |
| FR-FORM-02 | Forms are digitally filled and available to doctors pre-consultation                            |

### 3.5 Treatment Management
| ID         | Requirement                                                                                       |
|------------|---------------------------------------------------------------------------------------------------|
| FR-TREAT-01| Doctors submit diagnosis, treatment provided, and follow-up date                                 |
| FR-TREAT-02| Data is linked to the corresponding appointment record                                            |

### 3.6 Queue Tracking & Real-Time Updates
| ID         | Requirement                                                                                       |
|------------|---------------------------------------------------------------------------------------------------|
| FR-QUEUE-01| System displays real-time queue status to patients                                                |
| FR-QUEUE-02| Queue updated using WebSocket or polling every 30 seconds                                        |

### 3.7 Payment & Subscription
| ID         | Requirement                                                                                       |
|------------|---------------------------------------------------------------------------------------------------|
| FR-PAY-01  | Patients complete payments via Razorpay/Stripe (one-time or EMI)                                |
| FR-PAY-02  | Admin can view, track, and filter payments by method and date                                    |
| FR-PAY-03  | Payment logs are exportable as reports                                                            |

### 3.8 Gamified Dental Score
| ID         | Requirement                                                                                       |
|------------|---------------------------------------------------------------------------------------------------|
| FR-SCORE-01| Patients see a dental score based on visits, hygiene, and treatment severity                     |
| FR-SCORE-02| System updates score after every visit or form submission                                        |

## 4. Data Model (Logical View)

- User (id, name, email, password, role)
- Appointment (id, patient_id, doctor_id, date, time, tooth_id, symptoms, notes, status)
- TreatmentNote (id, appointment_id, diagnosis, treatment, follow_up_in_days)
- Payment (id, appointment_id, amount, method, status, plan_type)
- DentalScore (id, patient_id, score)
- Waitlist (id, patient_id, doctor_id, preferred_date, time_range)

## 5. Non-Functional Requirements

| Category           | Requirement                                                                                   |
|--------------------|-----------------------------------------------------------------------------------------------|
| Performance        | Queue status and page loads should update within 1 second                                    |
| Scalability        | Support 100 concurrent users in clinic during peak hours                                     |
| Security           | Password hashing, JWT-based auth, HTTPS, OWASP mitigations                                   |
| Availability       | 99.5% uptime expected for the deployed system                                                 |
| Maintainability    | Single-file backend (Flask) for MVP; modular components for frontend (React)                 |
| Accessibility      | Basic accessibility (contrast, keyboard navigation) for patient usability                    |
| Internationalisation| Support for INR/other currencies in payment gateway; regional support (Phase 2)            |

## 6. User Interface Mock-up Summary (Wireframes TBD)

- Patient Dashboard – Book appointment, view queue, score tracker, payment history
- Doctor Dashboard – View schedule, access patient data, submit treatment
- Admin Dashboard – Appointment logs, user management, payments, reports
- Chatbot Interface – Conversational symptom input before booking confirmation
- SVG Tooth Selector – Graphical interface for tooth selection
- Pre-Visit Form – Online submission of history, consent, allergies
- Queue Screen – Live updates showing estimated wait time and position
