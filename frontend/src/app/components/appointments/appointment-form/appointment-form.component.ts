import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-appointment-form',
  template: `
    <div class="appointment-form-container">
      <h2 mat-dialog-title>
        <mat-icon>event</mat-icon>
        Book Appointment
      </h2>
      <mat-dialog-content>
        <form [formGroup]="appointmentForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Select Doctor</mat-label>
            <mat-select formControlName="doctorId" (selectionChange)="onDoctorSelect($event)">
              <mat-option *ngFor="let doctor of doctors" [value]="doctor._id">
                <div class="doctor-option">
                  <mat-icon>medical_services</mat-icon>
                  <span>{{doctor.name}}</span>
                  <small>{{doctor.email}}</small>
                </div>
              </mat-option>
            </mat-select>
            <mat-icon matPrefix>person</mat-icon>
            <mat-error *ngIf="appointmentForm.get('doctorId')?.hasError('required')">Please select a doctor</mat-error>
            <mat-hint *ngIf="doctors.length === 0" class="loading-hint">
              <mat-spinner diameter="16"></mat-spinner>
              Loading doctors...
            </mat-hint>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Appointment Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" [min]="minDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-icon matPrefix>calendar_today</mat-icon>
            <mat-error *ngIf="appointmentForm.get('date')?.hasError('required')">Please select a date</mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Appointment Time</mat-label>
            <mat-select formControlName="time">
              <mat-option value="09:00 AM">09:00 AM</mat-option>
              <mat-option value="10:00 AM">10:00 AM</mat-option>
              <mat-option value="11:00 AM">11:00 AM</mat-option>
              <mat-option value="12:00 PM">12:00 PM</mat-option>
              <mat-option value="02:00 PM">02:00 PM</mat-option>
              <mat-option value="03:00 PM">03:00 PM</mat-option>
              <mat-option value="04:00 PM">04:00 PM</mat-option>
              <mat-option value="05:00 PM">05:00 PM</mat-option>
            </mat-select>
            <mat-icon matPrefix>schedule</mat-icon>
            <mat-error *ngIf="appointmentForm.get('time')?.hasError('required')">Please select a time</mat-error>
          </mat-form-field>
          
          <div class="info-box">
            <mat-icon>info</mat-icon>
            <p>Your appointment will be pending until approved by the doctor.</p>
          </div>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" [disabled]="loading">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="appointmentForm.invalid || loading">
          <mat-spinner *ngIf="loading" diameter="18" class="button-spinner"></mat-spinner>
          <span *ngIf="!loading">Book Appointment</span>
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .appointment-form-container {
      min-width: 450px;
    }
    
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #667eea;
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    h2 mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .doctor-option {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .doctor-option mat-icon {
      color: #667eea;
      font-size: 20px;
    }
    
    .doctor-option small {
      margin-left: auto;
      color: #999;
      font-size: 12px;
    }
    
    .loading-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #667eea;
    }
    
    .info-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 8px;
      margin-top: 10px;
    }
    
    .info-box mat-icon {
      color: #2196f3;
      font-size: 24px;
    }
    
    .info-box p {
      margin: 0;
      color: #1976d2;
      font-size: 14px;
    }
    
    .button-spinner {
      display: inline-block;
      margin-right: 8px;
    }
    
    ::ng-deep .mat-select-panel .mat-option {
      height: auto !important;
      padding: 12px 16px !important;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  doctors: any[] = [];
  loading = false;
  minDate = new Date();
  selectedDoctorName = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.authService.getDoctors().subscribe({
      next: (doctors: any[]) => {
        this.doctors = doctors;
        if (doctors.length === 0) {
          this.snackBar.open('No doctors available. Please contact admin.', 'Close', { duration: 5000 });
        }
      },
      error: (error: any) => {
        this.snackBar.open('Failed to load doctors', 'Close', { duration: 3000 });
        console.error('Error loading doctors:', error);
      }
    });
  }

  onDoctorSelect(event: any): void {
    const doctor = this.doctors.find(d => d._id === event.value);
    if (doctor) {
      this.selectedDoctorName = doctor.name;
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid && !this.loading) {
      this.loading = true;
      const formValue = this.appointmentForm.value;
      const doctor = this.doctors.find(d => d._id === formValue.doctorId);
      
      const appointmentData = {
        doctorId: formValue.doctorId,
        doctorName: doctor?.name || '',
        date: formValue.date,
        time: formValue.time
      };
      
      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.snackBar.open('Appointment booked successfully! Waiting for doctor approval.', 'Close', { duration: 4000 });
          this.dialogRef.close(response);
        },
        error: (error: any) => {
          this.loading = false;
          this.snackBar.open('Failed to book appointment: ' + (error.error?.message || 'Please try again'), 'Close', { duration: 5000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}