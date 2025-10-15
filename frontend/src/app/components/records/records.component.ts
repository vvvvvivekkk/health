import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecordService } from '../../services/record.service';
import { RecordFormComponent } from './record-form/record-form.component';

@Component({
  selector: 'app-records',
  template: `
    <div class="records-container">
      <div class="header">
        <h1>Medical Records</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> New Record
        </button>
      </div>
      
      <table mat-table [dataSource]="records" class="mat-elevation-z8 record-table">
        <!-- Student Name Column -->
        <ng-container matColumnDef="studentName">
          <th mat-header-cell *matHeaderCellDef>Student Name</th>
          <td mat-cell *matCellDef="let record">{{record.studentName}}</td>
        </ng-container>
        
        <!-- Blood Group Column -->
        <ng-container matColumnDef="bloodGroup">
          <th mat-header-cell *matHeaderCellDef>Blood Group</th>
          <td mat-cell *matCellDef="let record">{{record.bloodGroup}}</td>
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
            <button mat-icon-button color="primary" (click)="openEditDialog(record)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteRecord(record._id)">
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
    .records-container {
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .record-table {
      width: 100%;
    }
  `]
})
export class RecordsComponent implements OnInit {
  records: any[] = [];
  displayedColumns: string[] = ['studentName', 'bloodGroup', 'allergies', 'prescription', 'actions'];

  constructor(
    private recordService: RecordService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.recordService.getRecords().subscribe(
      data => {
        this.records = data;
      },
      error => {
        this.snackBar.open('Error loading medical records', 'Close', { duration: 3000 });
      }
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(RecordFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recordService.createRecord(result).subscribe(
          () => {
            this.loadRecords();
            this.snackBar.open('Medical record created successfully', 'Close', { duration: 3000 });
          },
          error => {
            this.snackBar.open('Error creating medical record', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  openEditDialog(record: any): void {
    const dialogRef = this.dialog.open(RecordFormComponent, {
      width: '500px',
      data: { mode: 'edit', record }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recordService.updateRecord(record._id, result).subscribe(
          () => {
            this.loadRecords();
            this.snackBar.open('Medical record updated successfully', 'Close', { duration: 3000 });
          },
          error => {
            this.snackBar.open('Error updating medical record', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  deleteRecord(id: string): void {
    if (confirm('Are you sure you want to delete this medical record?')) {
      this.recordService.deleteRecord(id).subscribe(
        () => {
          this.loadRecords();
          this.snackBar.open('Medical record deleted successfully', 'Close', { duration: 3000 });
        },
        error => {
          this.snackBar.open('Error deleting medical record', 'Close', { duration: 3000 });
        }
      );
    }
  }
}