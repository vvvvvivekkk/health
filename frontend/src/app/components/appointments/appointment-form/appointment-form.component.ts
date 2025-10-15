import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-appointment-form',
  template: `
    <h2 mat-dialog-title>{{data.mode === 'add' ? 'Add New' : 'Edit'}} Appointment</h2>
    <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Student Name</mat-label>
          <input matInput formControlName="studentName" placeholder="Enter student name">
          <mat-error *ngIf="appointmentForm.get('studentName')?.hasError('required')">
            Student name is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Doctor Name</mat-label>
          <input matInput formControlName="doctorName" placeholder="Enter doctor name">
          <mat-error *ngIf="appointmentForm.get('doctorName')?.hasError('required')">
            Doctor name is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="appointmentForm.get('date')?.hasError('required')">
            Date is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Time</mat-label>
          <input matInput formControlName="time" placeholder="e.g. 10:00 AM">
          <mat-error *ngIf="appointmentForm.get('time')?.hasError('required')">
            Time is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="scheduled">Scheduled</mat-option>
            <mat-option value="completed">Completed</mat-option>
            <mat-option value="cancelled">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="appointmentForm.invalid">
          {{data.mode === 'add' ? 'Add' : 'Update'}}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appointmentForm = this.fb.group({
      studentName: ['', Validators.required],
      doctorName: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      status: ['scheduled']
    });

    if (data.mode === 'edit' && data.appointment) {
      // Convert string date to Date object if needed
      const appointmentDate = data.appointment.date instanceof Date 
        ? data.appointment.date 
        : new Date(data.appointment.date);
        
      this.appointmentForm.patchValue({
        studentName: data.appointment.studentName,
        doctorName: data.appointment.doctorName,
        date: appointmentDate,
        time: data.appointment.time,
        status: data.appointment.status
      });
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.dialogRef.close(this.appointmentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}