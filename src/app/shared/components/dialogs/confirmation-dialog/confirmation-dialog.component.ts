import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogData } from './models/confirmation-dialog-data.model';

@Component({
  selector: 'am-confirmation-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  readonly data: ConfirmationDialogData = inject(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  handleConfirm(): void {
    this.dialogRef.close(true);
  }

  handleCancel(): void {
    this.dialogRef.close(false);
  }
}
