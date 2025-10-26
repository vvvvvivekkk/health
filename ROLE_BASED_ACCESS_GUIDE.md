# Role-Based Access Control Guide

## Overview

The Health Center Management System now has complete role-based access control with automatic student registration and proper permission management.

## Automatic Student Registration

### How It Works:
✅ **Every student who registers is automatically added to the Students list**
- When a student registers with @anurag.edu.in email
- They are immediately saved in the database with role: "student"
- They automatically appear in the "Students" section
- No manual entry needed!

### Access the Students List:
- **Admin**: Menu → View Students
- **Doctor**: Menu → View Students
- From there, you can view all registered students and manage their medical records

## Role-Based Permissions

### 👨‍🎓 STUDENT Role

**Can:**
- ✅ Register with @anurag.edu.in email
- ✅ Book appointments with any doctor
- ✅ View their own appointments
- ✅ Cancel PENDING appointments
- ✅ **View their own medical records (READ ONLY)**
- ✅ See their blood group, allergies, prescriptions

**Cannot:**
- ❌ Add or edit medical records
- ❌ Delete any records
- ❌ View other students' records
- ❌ Access admin or doctor features

### 👨‍⚕️ DOCTOR Role

**Can:**
- ✅ View all their appointments
- ✅ Approve/Reject appointments
- ✅ **View ALL medical records** (all students)
- ✅ **Add medical records for students**
- ✅ **Edit existing medical records**
- ✅ **View list of all registered students**
- ✅ Add medical records directly from student list
- ✅ Add medical records from approved appointments

**Cannot:**
- ❌ Delete medical records (only admin)
- ❌ Manage other doctors
- ❌ Delete appointments

### 🔧 ADMIN Role

**Can:**
- ✅ Everything a doctor can do, PLUS:
- ✅ **Delete medical records**
- ✅ Delete any appointment
- ✅ Manage doctors
- ✅ View all students
- ✅ Full system control

## How to Add Medical Records (Doctors & Admin Only)

### Method 1: From Students Page
1. Login as Doctor or Admin
2. Click Menu → "View Students"
3. Find the student
4. Click "Add Record" button
5. Form opens with student information pre-filled
6. Enter:
   - Blood Group
   - Allergies
   - Prescription
7. Click Save

### Method 2: From Approved Appointments
1. View appointments
2. Approve a student's appointment
3. Click "Add Medical Record" button
4. Form opens with student information pre-filled
5. Enter medical details
6. Click Save

### Method 3: From Medical Records Page
1. Click Menu → "Medical Records"
2. Click "New Record" button
3. Select student from dropdown
4. Enter medical details
5. Click Save

## Student Access to Records

### Viewing Their Records:
1. Student logs in
2. Click Menu → "My Records"
3. See all their medical records
4. **Cannot edit or delete** - read-only access
5. Can see:
   - Blood group
   - Allergies
   - Prescriptions
   - All medical history

## Navigation Menu

### Admin Menu:
- Dashboard
- All Appointments
- All Records
- Manage Doctors
- View Students
- Logout

### Doctor Menu:
- Dashboard
- My Appointments
- Medical Records
- **View Students** ← NEW!
- Logout

### Student Menu:
- Dashboard
- My Appointments
- My Records (Read-only)
- Logout

## Database Structure

### Students Collection:
- Automatically populated when students register
- Fields: name, email, password (hashed), role, createdAt, updatedAt
- Email must end with @anurag.edu.in

### Medical Records Collection:
- Links to student via studentId
- Fields: studentName, bloodGroup, allergies, prescription
- Created by doctors and admins only
- Students can only view their own

### Appointments Collection:
- Links doctor and student
- Status: pending, approved, rejected
- Doctors can approve/reject
- Students can book and view

## Testing the System

### As Admin:
1. Login: admin@hospital.com / admin123
2. View all students (automatically populated)
3. Add medical records for any student
4. Delete records if needed

### As Doctor:
1. Login: sarah.johnson@hospital.com / doctor123
2. Click "View Students"
3. See all registered students
4. Click "Add Record" for any student
5. View and edit all medical records

### As Student:
1. Register with email ending in @anurag.edu.in
2. You automatically appear in Students list
3. Book an appointment
4. After doctor approves, view your records
5. **Cannot edit** - read-only access

## Security Features

✅ **Backend Protection:**
- JWT authentication on all routes
- Role-based middleware checks
- Students can only GET their own records
- Doctors can GET all records, POST new, PUT existing
- Admin has full CRUD access

✅ **Frontend Protection:**
- Route guards prevent unauthorized access
- UI elements hidden based on role
- Add/Edit buttons only for doctors and admins
- Students see read-only views

## Benefits

1. **Automatic Management**: No manual student entry needed
2. **Clear Permissions**: Each role has specific capabilities
3. **Data Privacy**: Students only see their own records
4. **Professional Workflow**: Doctors can manage records efficiently
5. **Audit Trail**: All records tracked with timestamps
6. **Secure**: Multi-layer security with guards and middleware

## Common Workflows

### Student Registration → Medical Record:
1. Student registers with @anurag.edu.in
2. Student appears in Students list automatically
3. Student books appointment
4. Doctor approves appointment
5. Doctor adds medical record
6. Student can view (but not edit) their record

### Doctor Adding Record:
1. Doctor views Students page
2. Finds student
3. Clicks "Add Record"
4. Enters medical information
5. Record saved and visible to:
   - The student (read-only)
   - All doctors (can edit)
   - Admin (full control)

### Student Viewing Records:
1. Student logs in
2. Clicks "My Records"
3. Sees all their medical records
4. Can search and filter
5. Cannot modify anything
