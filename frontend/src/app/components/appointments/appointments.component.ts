import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  template: `
    <div class="appointments-container">
      <div class="header">
        <h1>
          <mat-icon>calendar_today</mat-icon>
          {{getPageTitle()}}
        </h1>
        <button mat-raised-button color="primary" (click)="openAppointmentForm()" *ngIf="userRole === 'student'">
          <mat-icon>add</mat-icon>
          Book Appointment
        </button>
      </div>
      
      <mat-form-field class="search-field" appearance="outline">
        <mat-label>Search appointments</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Search by student or doctor name">
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>
      
      <div class="table-container">
        <table mat-table [dataSource]="dataSource" matSort class="appointments-table">
          <!-- Student Name Column -->
          <ng-container matColumnDef="studentName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Student</th>
            <td mat-cell *matCellDef="let appointment">
              <div class="user-cell">
                <mat-icon>person</mat-icon>
                {{appointment.studentName}}
              </div>
            </td>
          </ng-container>
          
          <!-- Doctor Name Column -->
          <ng-container matColumnDef="doctorName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Doctor</th>
            <td mat-cell *matCellDef="let appointment">
              <div class="user-cell">
                <mat-icon>medical_services</mat-icon>
                {{appointment.doctorName}}
              </div>
            </td>
          </ng-container>
          
          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
            <td mat-cell *matCellDef="let appointment">{{appointment.date | date:'MMM d, y'}}</td>
          </ng-container>
          
          <!-- Time Column -->
          <ng-container matColumnDef="time">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Time</th>
            <td mat-cell *matCellDef="let appointment">
              <mat-icon class="time-icon">schedule</mat-icon>
              {{appointment.time}}
            </td>
          </ng-container>
          
          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
            <td mat-cell *matCellDef="let appointment">
              <mat-chip [ngClass]="getStatusClass(appointment.status)">
                {{appointment.status | uppercase}}
              </mat-chip>
            </td>
          </ng-container>
          
          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let appointment">
              <div class="action-buttons">
                <!-- Doctor Actions -->
                <button mat-icon-button color="accent" 
                        (click)="approveAppointment(appointment)" 
                        *ngIf="userRole === 'doctor' && appointment.status === 'pending'"
                        matTooltip="Approve Appointment">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" 
                        (click)="rejectAppointment(appointment)" 
                        *ngIf="userRole === 'doctor' && appointment.status === 'pending'"
                        matTooltip="Reject Appointment">
                  <mat-icon>cancel</mat-icon>
                </button>
                <button mat-raised-button color="primary" 
                        (click)="addMedicalRecord(appointment)" 
                        *ngIf="userRole === 'doctor' && appointment.status === 'approved'"
                        class="add-record-btn">
                  <mat-icon>note_add</mat-icon>
                  Add Medical Record
                </button>
                
                <!-- Admin Actions -->
                <button mat-icon-button color="accent" 
                        (click)="approveAppointment(appointment)" 
                        *ngIf="userRole === 'admin' && appointment.status === 'pending'"
                        matTooltip="Approve Appointment">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" 
                        (click)="rejectAppointment(appointment)" 
                        *ngIf="userRole === 'admin' && appointment.status === 'pending'"
                        matTooltip="Reject Appointment">
                  <mat-icon>cancel</mat-icon>
                </button>
                <button mat-icon-button color="warn" 
                        (click)="deleteAppointment(appointment)" 
                        *ngIf="userRole === 'admin'"
                        matTooltip="Delete Appointment">
                  <mat-icon>delete</mat-icon>
                </button>
                
                <!-- Student Actions -->
                <button mat-icon-button color="warn" 
                        (click)="deleteAppointment(appointment)" 
                        *ngIf="userRole === 'student' && appointment.status === 'pending'"
                        matTooltip="Cancel Appointment">
                  <mat-icon>cancel</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .appointments-container {
      padding: 24px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #333;
    }
    
    .header mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }
    
    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    .appointments-table {
      width: 100%;
    }
    
    .user-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .user-cell mat-icon {
      color: #667eea;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .time-icon {
      color: #2196f3;
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 4px;
      vertical-align: middle;
    }
    
    mat-chip {
      font-weight: 600;
      font-size: 12px;
    }
    
    .status-pending {
      background-color: #ff9800 !important;
      color: white !important;
    }
    
    .status-approved {
      background-color: #4caf50 !important;
      color: white !important;
    }
    
    .status-rejected {
      background-color: #f44336 !important;
      color: white !important;
    }
    
    .status-completed {
      background-color: #2196f3 !important;
      color: white !important;
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .add-record-btn {
      font-size: 13px;
      height: 36px;
    }
    
    th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }
  `]
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = ['studentName', 'doctorName', 'date', 'time', 'status', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  userRole = '';
  currentUser: any = null;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.currentUser?.role;
    this.loadAppointments();
  }

  getPageTitle(): string {
    switch (this.userRole) {
      case 'admin':
        return 'All Appointments';
      case 'doctor':
        return 'My Appointments';
      case 'student':
        return 'My Appointments';
      default:
        return 'Appointments';
    }
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments: any[]) => {
        this.dataSource = new MatTableDataSource(appointments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error: any) => {
        this.snackBar.open('Failed to load appointments', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  openAppointmentForm(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  approveAppointment(appointment: any): void {
    this.appointmentService.approveAppointment(appointment._id).subscribe({
      next: (updated: any) => {
        this.snackBar.open('Appointment approved successfully!', 'Close', { duration: 3000 });
        this.loadAppointments();
      },
      error: (error: any) => {
        this.snackBar.open('Failed to approve appointment', 'Close', { duration: 3000 });
      }
    });
  }

  rejectAppointment(appointment: any): void {
    if (confirm('Are you sure you want to reject this appointment?')) {
      this.appointmentService.rejectAppointment(appointment._id).subscribe({
        next: (updated: any) => {
          this.snackBar.open('Appointment rejected', 'Close', { duration: 3000 });
          this.loadAppointments();
        },
        error: (error: any) => {
          this.snackBar.open('Failed to reject appointment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteAppointment(appointment: any): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(appointment._id).subscribe({
        next: () => {
          this.snackBar.open('Appointment deleted!', 'Close', { duration: 3000 });
          this.loadAppointments();
        },
        error: (error: any) => {
          this.snackBar.open('Failed to delete appointment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  addMedicalRecord(appointment: any): void {
    // Navigate to records page with student info
    this.router.navigate(['/records'], {
      queryParams: {
        studentId: appointment.student,
        studentName: appointment.studentName,
        action: 'add'
      }
    });
  }
}