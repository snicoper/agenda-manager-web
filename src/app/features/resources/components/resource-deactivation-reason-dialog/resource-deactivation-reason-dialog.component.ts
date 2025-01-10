import { Component, effect, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface ResourceDeactivationReasonDialogData {
  deactivationReason: string;
}

@Component({
  selector: 'am-resource-deactivation-reason-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './resource-deactivation-reason-dialog.component.html',
  styleUrl: './resource-deactivation-reason-dialog.component.scss',
})
export class ResourceDeactivationReasonDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ResourceDeactivationReasonDialogComponent>);
  readonly data = inject<ResourceDeactivationReasonDialogData>(MAT_DIALOG_DATA);

  readonly inputError = signal<string | null>(null);
  readonly deactivationReason = model<string>(this.data.deactivationReason);

  constructor() {
    effect(() => {
      if (this.deactivationReason().length > 256) {
        this.inputError.set('El motivo de desactivación no puede superar los 256 caracteres');
      }
    });
  }

  handleClickCancel(): void {
    this.dialogRef.close();
  }
}
