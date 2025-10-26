import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-record-form',
  template: `
    <h2 mat-dialog-title>
      <mat-icon>description</mat-icon>
      {{data.mode === 'add' ? 'Add New' : 'Edit'}} Medical Record
    </h2>
    <form [formGroup]="recordForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width" *ngIf="(userRole === 'admin' || userRole === 'doctor') && !data.prefilledStudentId">
          <mat-label>Select Student</mat-label>
          <mat-select formControlName="studentId">
            <mat-option disabled *ngIf="students.length === 0">
              <mat-spinner diameter="20"></mat-spinner> Loading students...
            </mat-option>
            <mat-option *ngFor="let student of students" [value]="student._id">
              <div class="student-option">
                <mat-icon>person</mat-icon>
                <span>{{student.name}}</span>
                <small>({{student.email}})</small>
              </div>
            </mat-option>
          </mat-select>
          <mat-error *ngIf="recordForm.get('studentId')?.hasError('required')">
            Please select a student
          </mat-error>
          <mat-hint *ngIf="students.length === 0">Loading students from database...</mat-hint>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width" *ngIf="data.prefilledStudentId || userRole === 'student'">
          <mat-label>Student Name</mat-label>
          <input matInput formControlName="studentName" readonly>
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Blood Group</mat-label>
          <mat-select formControlName="bloodGroup">
            <mat-option value="A+">A+</mat-option>
            <mat-option value="A-">A-</mat-option>
            <mat-option value="B+">B+</mat-option>
            <mat-option value="B-">B-</mat-option>
            <mat-option value="AB+">AB+</mat-option>
            <mat-option value="AB-">AB-</mat-option>
            <mat-option value="O+">O+</mat-option>
            <mat-option value="O-">O-</mat-option>
          </mat-select>
          <mat-icon matPrefix>local_hospital</mat-icon>
          <mat-error *ngIf="recordForm.get('bloodGroup')?.hasError('required')">
            Blood group is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Allergies</mat-label>
          <textarea matInput formControlName="allergies" placeholder="Enter any allergies or 'None'" rows="3"></textarea>
          <mat-icon matPrefix>warning</mat-icon>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Prescription</mat-label>
          <textarea matInput formControlName="prescription" placeholder="Enter prescription details" rows="4"></textarea>
          <mat-icon matPrefix>medication</mat-icon>
        </mat-form-field>
      </div>
      
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="recordForm.invalid || students.length === 0 && !data.prefilledStudentId">
          <mat-icon>save</mat-icon>
          {{data.mode === 'add' ? 'Add Record' : 'Update Record'}}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #667eea;
    }
    
    .student-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .student-option mat-icon {
      color: #667eea;
      font-size: 20px;
    }
    
    .student-option small {
      margin-left: auto;
      color: #999;
      font-size: 12px;
    }
  `]
})
export class RecordFormComponent implements OnInit {
  recordForm: FormGroup;
  userRole = '';
  students: any[] = [];
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<RecordFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.currentUser?.role;
    
    this.recordForm = this.fb.group({
      studentId: ['', this.userRole !== 'student' ? Validators.required : null],
      studentName: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      allergies: ['None'],
      prescription: ['None']
    });

    if (data.mode === 'edit' && data.record) {
      this.recordForm.patchValue({
        studentName: data.record.studentName,
        bloodGroup: data.record.bloodGroup,
        allergies: data.record.allergies,
        prescription: data.record.prescription
      });
    } else if (this.userRole === 'student') {
      // Pre-fill student name for students
      this.recordForm.patchValue({
        studentName: this.currentUser?.name || ''
      });
    } else if (data.prefilledStudentId && data.prefilledStudentName) {
      // Pre-fill from appointment or student page
      this.recordForm.patchValue({
        studentId: data.prefilledStudentId,
        studentName: data.prefilledStudentName
      });
      // Don't disable - just set the value
    }
    
    // Load students immediately if user is doctor or admin
    if (this.userRole === 'admin' || this.userRole === 'doctor') {
      this.loadStudents();
    }
  }

  ngOnInit(): void {
    // Auto-populate student name when student is selected
    this.recordForm.get('studentId')?.valueChanges.subscribe(studentId => {
      const student = this.students.find(s => s._id === studentId);
      if (student) {
        this.recordForm.patchValue({
          studentName: student.name
        });
      }
    });
  }

  loadStudents(): void {
    console.log('🔄 Loading students... Role:', this.userRole);
    console.log('📍 Auth token exists:', !!this.authService.getToken());
    
    const startTime = Date.now();
    
    this.authService.getStudents().subscribe({
      next: (students: any[]) => {
        const loadTime = Date.now() - startTime;
        console.log(`✅ Successfully loaded ${students.length} students in ${loadTime}ms`);
        console.log('Students:', students);
        this.students = students;
        
        if (students.length === 0) {
          console.warn('⚠️ No students found in database.');
        }
      },
      error: (error: any) => {
        const loadTime = Date.now() - startTime;
        console.error(`❌ Error loading students after ${loadTime}ms`);
        console.error('Error object:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('URL:', error.url);
        
        // Set empty array so form doesn't hang
        this.students = [];
        
        // Show user-friendly message
        if (error.status === 401) {
          alert('Authentication failed. Please log out and log back in.');
        } else if (error.status === 0) {
          alert('Cannot connect to server. Please check if the backend is running on port 3003.');
        } else {
          alert('Failed to load students: ' + (error.error?.message || error.message));
        }
      }
    });
    
    // Timeout check after 5 seconds
    setTimeout(() => {
      if (this.students.length === 0) {
        console.warn('⏱️ Loading students is taking longer than expected (5+ seconds)');
      }
    }, 5000);
  }

  onSubmit(): void {
    console.log('📤 Submitting form...');
    console.log('Form valid:', this.recordForm.valid);
    console.log('Form value:', this.recordForm.value);
    console.log('Form raw value:', this.recordForm.getRawValue());
    
    // Get raw value to include disabled fields
    const formValue = this.recordForm.getRawValue();
    
    // Validate based on role
    if (this.userRole === 'student') {
      // Students don't need to select studentId
      if (!formValue.bloodGroup || !formValue.studentName) {
        alert('Please fill in all required fields');
        return;
      }
    } else {
      // Doctors and admins need to select a student
      if (!formValue.studentId && !this.data.prefilledStudentId) {
        alert('Please select a student');
        return;
      }
      if (!formValue.bloodGroup) {
        alert('Please select a blood group');
        return;
      }
    }
    
    const result: any = {
      bloodGroup: formValue.bloodGroup,
      allergies: formValue.allergies || 'None',
      prescription: formValue.prescription || 'None'
    };
    
    // Handle studentId based on context
    if (this.data.prefilledStudentId) {
      // Coming from appointment or student page
      result.studentId = String(this.data.prefilledStudentId);
      result.studentName = this.data.prefilledStudentName || formValue.studentName;
    } else if (formValue.studentId) {
      // Ensure studentId is a string, not an object
      const studentIdValue = typeof formValue.studentId === 'object' 
        ? formValue.studentId._id || formValue.studentId.id || JSON.stringify(formValue.studentId)
        : String(formValue.studentId);
      
      console.log('🔍 Student ID type:', typeof formValue.studentId);
      console.log('🔍 Student ID value:', studentIdValue);
      
      // Doctor/Admin selected from dropdown
      const student = this.students.find(s => s._id === studentIdValue);
      if (student) {
        result.studentId = String(student._id);
        result.studentName = student.name;
        console.log('✅ Found student:', student.name, 'ID:', result.studentId);
      } else {
        result.studentId = studentIdValue;
        result.studentName = formValue.studentName;
        console.log('⚠️ Student not found in list, using direct value');
      }
    } else if (this.userRole === 'student') {
      // Student creating their own record
      result.studentId = String(this.currentUser._id);
      result.studentName = this.currentUser.name;
    }
    
    console.log('✅ Final result to submit:', result);
    console.log('📋 StudentId type:', typeof result.studentId, '| Value:', result.studentId);
    
    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}