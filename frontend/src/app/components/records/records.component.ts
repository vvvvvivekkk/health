import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecordService } from '../../services/record.service';
import { AuthService } from '../../services/auth.service';
import { RecordFormComponent } from './record-form/record-form.component';

@Component({
  selector: 'app-records',
  template: `
    <div class="records-container">
      <div class="header">
        <h1>
          <mat-icon>description</mat-icon>
          Medical Records
        </h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()" *ngIf="userRole === 'admin' || userRole === 'doctor'">
          <mat-icon>add</mat-icon>
          New Record
        </button>
      </div>
      
      <mat-form-field class="search-field" appearance="outline">
        <mat-label>Search records</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Search by student name or disease">
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>
      
      <div class="table-container">
        <table mat-table [dataSource]="filteredRecords" class="mat-elevation-z8 record-table">
          <!-- Student Name Column -->
          <ng-container matColumnDef="studentName">
            <th mat-header-cell *matHeaderCellDef>Student Name</th>
            <td mat-cell *matCellDef="let record">
              <div class="user-cell">
                <mat-icon>person</mat-icon>
                {{record.studentName}}
              </div>
            </td>
          </ng-container>
          
          <!-- Blood Group Column -->
          <ng-container matColumnDef="bloodGroup">
            <th mat-header-cell *matHeaderCellDef>Blood Group</th>
            <td mat-cell *matCellDef="let record">
              <mat-chip color="accent">{{record.bloodGroup}}</mat-chip>
            </td>
          </ng-container>
          
          <!-- Allergies Column -->
          <ng-container matColumnDef="allergies">
            <th mat-header-cell *matHeaderCellDef>Allergies</th>
            <td mat-cell *matCellDef="let record">{{record.allergies}}</td>
          </ng-container>
          
          <!-- Prescription Column -->
          <ng-container matColumnDef="prescription">
            <th mat-header-cell *matHeaderCellDef>Prescription</th>
            <td mat-cell *matCellDef="let record">{{record.prescription}}</td>
          </ng-container>
          
          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let record">
              <button mat-icon-button color="primary" (click)="openEditDialog(record)" *ngIf="userRole === 'admin' || userRole === 'doctor'" matTooltip="Edit Record">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteRecord(record._id)" *ngIf="userRole === 'admin'" matTooltip="Delete Record">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      
      <div *ngIf="filteredRecords.length === 0" class="no-data">
        <mat-icon>inbox</mat-icon>
        <p>No medical records found</p>
      </div>
    </div>
  `,
  styles: [`
    .records-container {
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
    
    .record-table {
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
  `]
})
export class RecordsComponent implements OnInit {
  records: any[] = [];
  displayedColumns: string[] = ['studentName', 'bloodGroup', 'allergies', 'prescription', 'actions'];
  userRole = '';
  currentUser: any = null;
  filteredRecords: any[] = [];

  constructor(
    private recordService: RecordService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.currentUser?.role;
    this.loadRecords();
    
    // Check if we need to automatically open the add dialog
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'add' && params['studentId']) {
        setTimeout(() => {
          this.openAddDialogForStudent(params['studentId'], params['studentName']);
        }, 500);
      }
    });
  }

  loadRecords(): void {
    this.recordService.getRecords().subscribe({
      next: (data: any[]) => {
        this.records = data;
        this.filteredRecords = data;
      },
      error: (error: any) => {
        this.snackBar.open('Error loading medical records', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredRecords = this.records.filter(record => 
      record.studentName.toLowerCase().includes(filterValue) ||
      record.allergies.toLowerCase().includes(filterValue) ||
      record.prescription.toLowerCase().includes(filterValue)
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(RecordFormComponent, {
      width: '600px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('📤 Submitting record:', result);
        this.recordService.createRecord(result).subscribe({
          next: (response) => {
            console.log('✅ Record created successfully:', response);
            this.loadRecords();
            this.snackBar.open('Medical record created successfully', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            console.error('❌ Error creating medical record:', error);
            console.error('Status:', error.status);
            console.error('Error details:', error.error);
            const errorMsg = error.error?.message || error.message || 'Unknown error';
            this.snackBar.open('Error creating medical record: ' + errorMsg, 'Close', { duration: 5000 });
          }
        });
      } else {
        console.log('❌ Dialog closed without result');
      }
    });
  }

  openAddDialogForStudent(studentId: string, studentName: string): void {
    const dialogRef = this.dialog.open(RecordFormComponent, {
      width: '600px',
      data: { 
        mode: 'add',
        prefilledStudentId: studentId,
        prefilledStudentName: studentName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('📤 Submitting record for student:', studentName, result);
        this.recordService.createRecord(result).subscribe({
          next: (response) => {
            console.log('✅ Record created successfully:', response);
            this.loadRecords();
            this.snackBar.open('Medical record created successfully for ' + studentName, 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            console.error('❌ Error creating medical record:', error);
            console.error('Status:', error.status);
            console.error('Error details:', error.error);
            const errorMsg = error.error?.message || error.message || 'Unknown error';
            this.snackBar.open('Error: ' + errorMsg, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  openEditDialog(record: any): void {
    const dialogRef = this.dialog.open(RecordFormComponent, {
      width: '600px',
      data: { mode: 'edit', record }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recordService.updateRecord(record._id, result).subscribe({
          next: () => {
            this.loadRecords();
            this.snackBar.open('Medical record updated successfully', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            this.snackBar.open('Error updating medical record', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteRecord(id: string): void {
    if (confirm('Are you sure you want to delete this medical record?')) {
      this.recordService.deleteRecord(id).subscribe({
        next: () => {
          this.loadRecords();
          this.snackBar.open('Medical record deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error: any) => {
          this.snackBar.open('Error deleting medical record', 'Close', { duration: 3000 });
        }
      });
    }
  }
}