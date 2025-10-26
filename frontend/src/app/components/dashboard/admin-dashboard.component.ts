import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { RecordService } from '../../services/record.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard-container">
      <h1>Admin Dashboard</h1>
      
      <div class="stats-container">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Appointments</mat-card-title>
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
            <button mat-button color="primary" routerLink="/records">View All</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Doctors</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{doctorsCount}}</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/doctors">Manage Doctors</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Students</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{studentsCount}}</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/students">View Students</button>
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
      border-left: 4px solid #3f51b5;
    }
    
    .stat-number {
      font-size: 48px;
      font-weight: bold;
      text-align: center;
      padding: 20px 0;
      color: #3f51b5;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  appointmentsCount = 0;
  recordsCount = 0;
  doctorsCount = 0;
  studentsCount = 0;

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
      }
    );

    this.recordService.getRecords().subscribe(
      records => {
        this.recordsCount = records.length;
      }
    );

    // For demo purposes, we'll use static data
    // In a real app, you would fetch this from the backend
    this.doctorsCount = 5;
    this.studentsCount = 150;
  }
}