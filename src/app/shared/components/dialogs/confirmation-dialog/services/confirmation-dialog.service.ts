import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog.component';
import { ConfirmationDialogData } from '../models/confirmation-dialog-data.model';

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data,
        width: '400px',
        disableClose: true,
        autoFocus: 'dialog',
      })
      .afterClosed();
  }
}
