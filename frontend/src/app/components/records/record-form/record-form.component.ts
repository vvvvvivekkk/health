import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-record-form',
  template: `
    <h2 mat-dialog-title>{{data.mode === 'add' ? 'Add New' : 'Edit'}} Medical Record</h2>
    <form [formGroup]="recordForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Student Name</mat-label>
          <input matInput formControlName="studentName" placeholder="Enter student name">
          <mat-error *ngIf="recordForm.get('studentName')?.hasError('required')">
            Student name is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Blood Group</mat-label>
          <mat-select formControlName="bloodGroup">
            <mat-option value="A+">A+</mat-option>
            <mat-option value="A-">A-</mat-option>
            <mat-option value="B+">B+</mat-option>
            <mat-option value="B-">B-</mat-option>
            <mat-option value="AB+">AB+</mat-option>
            <mat-option value="AB-">AB-</mat-option>
            <mat-option value="O+">O+</mat-option>
            <mat-option value="O-">O-</mat-option>
          </mat-select>
          <mat-error *ngIf="recordForm.get('bloodGroup')?.hasError('required')">
            Blood group is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Allergies</mat-label>
          <textarea matInput formControlName="allergies" placeholder="Enter allergies (if any)"></textarea>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Prescription</mat-label>
          <textarea matInput formControlName="prescription" placeholder="Enter prescription details"></textarea>
        </mat-form-field>
      </div>
      
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="recordForm.invalid">
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
export class RecordFormComponent {
  recordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecordFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.recordForm = this.fb.group({
      studentName: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      allergies: ['None'],
      prescription: ['None']
    });

    if (data.mode === 'edit' && data.record) {
      this.recordForm.patchValue({
        studentName: data.record.studentName,
        bloodGroup: data.record.bloodGroup,
        allergies: data.record.allergies,
        prescription: data.record.prescription
      });
    }
  }

  onSubmit(): void {
    if (this.recordForm.valid) {
      this.dialogRef.close(this.recordForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}