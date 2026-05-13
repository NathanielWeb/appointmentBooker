# Appointment Booker Project (PhysFind)

## How to Run the Project

## Deployment

The project is deployed on Vercel:

- Vercel Deployment: <a href="https://appointment-booker-38lnzm8me-nathanielwebs-projects.vercel.app/" target="_blank" rel="noopener noreferrer">Link to Vercel deployment</a>

---

## Patient Accounts

To test patient booking, start by creating an account:

- Click “Get Started” under the app description, or
- Click “Register” in the top-right navigation.

This will open a registration form where you can create a new patient account. After registration, you will be redirected to the patient dashboard.

## Demo Patient Accounts (optional login)

You can also log in using pre-seeded accounts:

- patient1
- patient2
- patient3

Password for all patient accounts:

- pass123

The patient login buttons can be found in similar places to the registration buttons.

## Booking Flow (Patient)

After logging in:

1. Navigate to the patient dashboard (this is done automatically).
2. Click “Book Appointment”
3. Select a physician (each has a specialty)
4. Choose a date from the calendar.
5. View available time slots for that date.
6. Select a time slot
7. Fill in appointment details (reason and notes)
8. Submit the booking

After submission:

- The appointment status will be “pending.”
- It must be confirmed by the corresponding physician before it becomes active.

## Canceling Appointments

- Each appointment includes a Cancel button.
- Cancellation requires confirmation
- This action is irreversible.

## Logout

- Use the Logout button in the top-right corner.

---

## Physician / Admin Accounts

## Accessing Admin / Physician Login

You can log in as a physician or admin via:

- “Administration Login” on the login page, or
- “Admin / Physician Login” on the homepage

## Physician Accounts

- dr_smith
- dr_jones
- dr_lee

Password for all physician accounts:

- pass123

## Physician Dashboard Features

After login, physicians can:

- View all their scheduled appointments.
- Confirm or cancel upcoming appointments.
- Filter appointments by date using the calendar input

---

## Admin Account

- Username: admin
- Password: admin123

## Admin Dashboard Features

Admins can:

- View all appointments across all physicians and patients.
- Filter appointments by date

---

## What I Built

The Appointment Booker application (PhysFind) is a lightweight appointment booking system with three roles:

- Patients
- Physicians
- Administrators

## Core Features

- Patient appointment booking flow (physician, date, time, details)
- Physician dashboard for managing appointments
- Admin dashboard for system-wide oversight
- JWT-based authentication (username/password only)
- Role-based routing and API access control
- Server-side conflict prevention for scheduling
- Seeded demo accounts for quick testing

## Tech Stack

- Frontend: Next.js (App Router), React, TypeScript, TailwindCSS
- Backend: Django REST Framework
- Database: PostgreSQL

---

## Key Technical / Product Decisions

## 1. JWT-Based Authentication

JWT was chosen to decouple the frontend and backend and simplify deployment.

- Stored in httpOnly cookies
- Avoids exposing tokens to client-side JavaScript
- Keeps authentication stateless

---

## 2. Role-Based User Model

A single user model with a role field is used instead of multiple auth systems.

Benefits:

- Centralized authorization logic
- Simpler backend design
- Easier role-based routing on the frontend

---

## 3. Django App Separation

The backend is split into three domain-focused apps:

- accounts → authentication and user model
- physicians → physician profiles and metadata
- appointments → booking logic and scheduling rules

This improves maintainability and separation of concerns.

---

## 4. Server-Side Scheduling Integrity

All booking rules are enforced on the backend:

- Prevent double-booking for a physician.
- Prevent overlapping appointments for the same physician and time slot.
- Enforce consistent appointment statuses (pending, confirmed, cancelled)
- Prohibit booking or modifying appointments for past dates.

This ensures the frontend cannot bypass business rules.

---

## 5. Availability as a Backend Responsibility

Instead of calculating availability on the client:

- The backend exposes booked time slots for each physician and date.
- The frontend only renders validated availability data.

This avoids inconsistencies across clients.

---

## What I Would Improve With More Time

## 1. Email-Based Authentication

The current system does not use email verification.

If extended:

- Add email verification
- Enable password reset functionality.
- Improve account recovery flows.

---

## 2. Physician Availability Management

Currently, physician availability is fixed.

Future improvement:

- Allow physicians to define custom availability windows.
- Support dynamic scheduling rules per physician.
- Improve backend scheduling model flexibility.