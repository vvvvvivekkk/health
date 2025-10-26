import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students',
  template: `
    <div class="students-container">
      <div class="header">
        <h1>
          <mat-icon>school</mat-icon>
          Registered Students
        </h1>
        <div class="info-chip">
          <mat-icon>info</mat-icon>
          <span>Students are automatically added when they register</span>
        </div>
      </div>
      
      <mat-form-field class="search-field" appearance="outline">
        <mat-label>Search students</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or email">
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>
      
      <div class="table-container">
        <table mat-table [dataSource]="filteredStudents" class="students-table">
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Student Name</th>
            <td mat-cell *matCellDef="let student">
              <div class="user-cell">
                <mat-icon>person</mat-icon>
                <span>{{student.name}}</span>
              </div>
            </td>
          </ng-container>
          
          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email Address</th>
            <td mat-cell *matCellDef="let student">
              <div class="email-cell">
                <mat-icon>email</mat-icon>
                {{student.email}}
              </div>
            </td>
          </ng-container>
          
          <!-- Registration Date Column -->
          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Registered On</th>
            <td mat-cell *matCellDef="let student">
              <div class="date-cell">
                <mat-icon>event</mat-icon>
                {{student.createdAt | date:'MMM d, y'}}
              </div>
            </td>
          </ng-container>
          
          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let student">
              <div class="action-buttons">
                <button mat-raised-button color="primary" (click)="viewRecords(student)" class="action-btn">
                  <mat-icon>description</mat-icon>
                  View Records
                </button>
                <button mat-raised-button color="accent" (click)="addRecord(student)" *ngIf="userRole === 'admin' || userRole === 'doctor'" class="action-btn">
                  <mat-icon>note_add</mat-icon>
                  Add Record
                </button>
              </div>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <div *ngIf="filteredStudents.length === 0" class="no-data">
          <mat-icon>inbox</mat-icon>
          <p>No students registered yet</p>
          <small>Students will automatically appear here when they register with @anurag.edu.in email</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .students-container {
      padding: 24px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
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
    
    .info-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #e3f2fd;
      border-radius: 20px;
      color: #1976d2;
      font-size: 14px;
    }
    
    .info-chip mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
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
    
    .students-table {
      width: 100%;
    }
    
    .user-cell, .email-cell, .date-cell {
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
    
    .email-cell mat-icon {
      color: #2196f3;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .date-cell mat-icon {
      color: #4caf50;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .action-btn {
      font-size: 13px;
      height: 36px;
    }
    
    th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }
    
    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }
    
    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }
    
    .no-data small {
      display: block;
      margin-top: 8px;
      color: #bbb;
    }
  `]
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  displayedColumns: string[] = ['name', 'email', 'createdAt', 'actions'];
  userRole = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userRole = user?.role;
    this.loadStudents();
  }

  loadStudents(): void {
    this.authService.getStudents().subscribe({
      next: (students: any[]) => {
        this.students = students;
        this.filteredStudents = students;
      },
      error: (error: any) => {
        this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredStudents = this.students.filter(student => 
      student.name.toLowerCase().includes(filterValue) ||
      student.email.toLowerCase().includes(filterValue)
    );
  }

  viewRecords(student: any): void {
    this.router.navigate(['/records'], {
      queryParams: {
        studentId: student._id,
        studentName: student.name,
        action: 'view'
      }
    });
  }

  addRecord(student: any): void {
    this.router.navigate(['/records'], {
      queryParams: {
        studentId: student._id,
        studentName: student.name,
        action: 'add'
      }
    });
  }
}