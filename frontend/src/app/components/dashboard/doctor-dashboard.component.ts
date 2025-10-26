import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { RecordService } from '../../services/record.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  template: `
    <div class="dashboard-container">
      <h1>Doctor Dashboard</h1>
      
      <div class="stats-container">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>My Appointments</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{appointmentsCount}}</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/appointments">View All</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Medical Records</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{recordsCount}}</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/records">Manage Records</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Pending Approvals</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{pendingCount}}</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/appointments">Approve Appointments</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    
    .stats-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 20px;
    }
    
    .stat-card {
      width: 300px;
      background: #f5f5f5;
      border-left: 4px solid #4caf50;
    }
    
    .stat-number {
      font-size: 48px;
      font-weight: bold;
      text-align: center;
      padding: 20px 0;
      color: #4caf50;
    }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  appointmentsCount = 0;
  recordsCount = 0;
  pendingCount = 0;

  constructor(
    private appointmentService: AppointmentService,
    private recordService: RecordService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.appointmentService.getAppointments().subscribe(
      appointments => {
        this.appointmentsCount = appointments.length;
        this.pendingCount = appointments.filter(a => a.status === 'pending').length;
      }
    );

    this.recordService.getRecords().subscribe(
      records => {
        this.recordsCount = records.length;
      }
    );
  }
}