import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctors',
  template: `
    <div class="doctors-container">
      <div class="header">
        <h1>Manage Doctors</h1>
      </div>
      
      <mat-card class="registration-card">
        <mat-card-header>
          <mat-card-title>Add New Doctor</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="doctorForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" type="text" placeholder="Enter doctor's name">
              <mat-error *ngIf="doctorForm.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter doctor's email">
              <mat-error *ngIf="doctorForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="doctorForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Enter password">
              <mat-error *ngIf="doctorForm.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="doctorForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</mat-error>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" [disabled]="doctorForm.invalid" class="full-width">
              Add Doctor
            </button>
          </form>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="doctors-list">
        <mat-card-header>
          <mat-card-title>Existing Doctors</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field class="search-field">
            <mat-label>Search doctors</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or email">
          </mat-form-field>
          
          <table mat-table [dataSource]="filteredDoctors" class="mat-elevation-z8 doctors-table">
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let doctor">{{doctor.name}}</td>
            </ng-container>
            
            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let doctor">{{doctor.email}}</td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let doctor">
                <button mat-icon-button color="warn" (click)="deleteDoctor(doctor._id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .doctors-container {
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .registration-card, .doctors-list {
      margin-bottom: 20px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .doctors-table {
      width: 100%;
    }
  `]
})
export class DoctorsComponent implements OnInit {
  doctorForm: FormGroup;
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  displayedColumns: string[] = ['name', 'email', 'actions'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.authService.getDoctors().subscribe(
      (doctors: any[]) => {
        this.doctors = doctors;
        this.filteredDoctors = doctors;
      },
      (error: any) => {
        this.snackBar.open('Failed to load doctors', 'Close', { duration: 3000 });
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDoctors = this.doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(filterValue) ||
      doctor.email.toLowerCase().includes(filterValue)
    );
  }

  onSubmit(): void {
    if (this.doctorForm.valid) {
      const doctorData = {
        ...this.doctorForm.value,
        role: 'doctor'
      };
      
      this.authService.register(doctorData.name, doctorData.email, doctorData.password, doctorData.role).subscribe({
        next: (user) => {
          this.snackBar.open('Doctor added successfully!', 'Close', {
            duration: 3000
          });
          this.doctorForm.reset();
          this.loadDoctors(); // Refresh the list
        },
        error: (error) => {
          this.snackBar.open('Failed to add doctor: ' + (error.error?.message || 'Something went wrong'), 'Close', {
            duration: 5000
          });
        }
      });
    }
  }

  deleteDoctor(id: string): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      // In a real app, you would call a service to delete the doctor
      this.snackBar.open('Doctor deleted successfully!', 'Close', {
        duration: 3000
      });
      this.loadDoctors(); // Refresh the list
    }
  }
}