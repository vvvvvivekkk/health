import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointments',
  template: `
    <div class="appointments-container">
      <div class="header">
        <h1>Appointments</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> New Appointment
        </button>
      </div>
      
      <table mat-table [dataSource]="appointments" class="mat-elevation-z8 appointment-table">
        <!-- Student Name Column -->
        <ng-container matColumnDef="studentName">
          <th mat-header-cell *matHeaderCellDef>Student Name</th>
          <td mat-cell *matCellDef="let appointment">{{appointment.studentName}}</td>
        </ng-container>
        
        <!-- Doctor Name Column -->
        <ng-container matColumnDef="doctorName">
          <th mat-header-cell *matHeaderCellDef>Doctor Name</th>
          <td mat-cell *matCellDef="let appointment">{{appointment.doctorName}}</td>
        </ng-container>
        
        <!-- Date Column -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let appointment">{{appointment.date | date}}</td>
        </ng-container>
        
        <!-- Time Column -->
        <ng-container matColumnDef="time">
          <th mat-header-cell *matHeaderCellDef>Time</th>
          <td mat-cell *matCellDef="let appointment">{{appointment.time}}</td>
        </ng-container>
        
        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let appointment">{{appointment.status}}</td>
        </ng-container>
        
        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let appointment">
            <button mat-icon-button color="primary" (click)="openEditDialog(appointment)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteAppointment(appointment._id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .appointments-container {
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .appointment-table {
      width: 100%;
    }
  `]
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  displayedColumns: string[] = ['studentName', 'doctorName', 'date', 'time', 'status', 'actions'];

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      data => {
        this.appointments = data;
      },
      error => {
        this.snackBar.open('Error loading appointments', 'Close', { duration: 3000 });
      }
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.createAppointment(result).subscribe(
          () => {
            this.loadAppointments();
            this.snackBar.open('Appointment created successfully', 'Close', { duration: 3000 });
          },
          error => {
            this.snackBar.open('Error creating appointment', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  openEditDialog(appointment: any): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '500px',
      data: { mode: 'edit', appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.updateAppointment(appointment._id, result).subscribe(
          () => {
            this.loadAppointments();
            this.snackBar.open('Appointment updated successfully', 'Close', { duration: 3000 });
          },
          error => {
            this.snackBar.open('Error updating appointment', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  deleteAppointment(id: string): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe(
        () => {
          this.loadAppointments();
          this.snackBar.open('Appointment deleted successfully', 'Close', { duration: 3000 });
        },
        error => {
          this.snackBar.open('Error deleting appointment', 'Close', { duration: 3000 });
        }
      );
    }
  }
}