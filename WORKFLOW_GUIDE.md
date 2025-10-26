# Appointment and Medical Records Workflow

## Complete Workflow Implementation

### 1. Student Books Appointment
- Student logs in and navigates to Appointments
- Clicks "Book Appointment" button
- Selects a doctor from dropdown (shows all available doctors)
- Chooses date and time
- Appointment is created with status: **PENDING**

### 2. Doctor Views and Approves Appointment
- Doctor logs in and sees their appointments
- **PENDING** appointments show with Approve/Reject buttons
- Doctor clicks "Approve" (✓) button
- Appointment status changes to: **APPROVED**
- Student can now see the approved status in their appointments list

### 3. Doctor Adds Medical Record for Student
After approving an appointment:
- **APPROVED** appointments show "Add Medical Record" button
- Doctor clicks "Add Medical Record"
- Automatically navigates to Medical Records page
- Medical record form opens with student information pre-filled
- Doctor enters:
  - Blood Group
  - Allergies
  - Prescription
- Saves the medical record
- Record is now visible to:
  - The student (in their records view)
  - All doctors (can view/edit)
  - Admin (can view/edit/delete)

### 4. Student Views Their Medical Records
- Student logs in and navigates to "My Records"
- Sees all medical records created for them
- Can view but cannot edit or delete
- Shows:
  - Blood group
  - Allergies
  - Prescriptions
  - All medical history

## Features by Role

### Student Can:
✅ Book appointments with any doctor
✅ View their own appointments (all statuses)
✅ Cancel PENDING appointments
✅ View their own medical records
❌ Cannot edit or delete records
❌ Cannot approve appointments

### Doctor Can:
✅ View all their appointments
✅ Approve/Reject PENDING appointments
✅ Add medical records for students (especially after approved appointments)
✅ View ALL medical records
✅ Edit medical records
❌ Cannot delete medical records
❌ Cannot view other doctors' appointments

### Admin Can:
✅ View ALL appointments (all students, all doctors)
✅ Approve/Reject ANY appointment
✅ Delete any appointment
✅ Add/Edit medical records
✅ Delete medical records
✅ Manage doctors
✅ View all students

## Status Flow

```
PENDING → APPROVED → Medical Record Added
    ↓
REJECTED (End)
```

## UI Improvements

### Appointments Page:
- Color-coded status chips:
  - 🟠 PENDING (Orange)
  - 🟢 APPROVED (Green)
  - 🔴 REJECTED (Red)
  - 🔵 COMPLETED (Blue)
- Icon buttons for quick actions
- "Add Medical Record" button appears for approved appointments (doctor only)
- Search functionality
- Sortable columns

### Medical Records Page:
- Clean table view with patient information
- Search by student name or medical condition
- Automatic form opening when navigating from appointments
- Pre-filled student information
- Blood group displayed as colored chips

## Technical Implementation

### Frontend:
- Query parameters used to pass student info from appointments to records
- Automatic dialog opening based on URL parameters
- Real-time updates after approval/rejection
- Proper role-based UI rendering

### Backend:
- JWT authentication on all routes
- Role-based middleware protection
- Appointment approval/rejection endpoints
- Medical records linked to students via studentId

## Testing the Workflow

1. **Login as Student**: stuv@anurag.edu.in / [your password]
   - Book an appointment with any doctor

2. **Login as Doctor**: sarah.johnson@hospital.com / doctor123
   - See the pending appointment
   - Click "Approve" (✓)
   - Click "Add Medical Record"
   - Fill in blood group, allergies, prescription
   - Save

3. **Login as Student** again:
   - View appointments - see status changed to APPROVED
   - View records - see the newly created medical record

## Benefits

- ✅ Streamlined workflow from appointment to medical record
- ✅ One-click navigation from appointment to adding records
- ✅ Student information automatically populated
- ✅ Real-time status updates
- ✅ Complete audit trail
- ✅ Role-based access control enforced
