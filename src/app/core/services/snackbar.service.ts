import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

/** Wrapper tipo toast. */
@Injectable({ providedIn: 'root' })
export class SnackBarService {
  private readonly matSnackBar = inject(MatSnackBar);

  /**
   * Muestra un mensaje tipo success en la posición de posX y posY.
   * Por defecto top right.
   *
   * @param message Mensaje a mostrar
   * @param posY MatSnackBarVerticalPosition ('top' | 'bottom').
   * @param posX MatSnackBarHorizontalPosition ('start' | 'center' | 'end' | 'left' | 'right').
   * @param duration Duración en milisegundos.
   */
  success(
    message: string,
    posY: MatSnackBarVerticalPosition = 'top',
    posX: MatSnackBarHorizontalPosition = 'right',
    duration = 3000,
  ): void {
    this.matSnackBar.open(message, 'X', {
      panelClass: ['snackbar-success'],
      verticalPosition: posY,
      horizontalPosition: posX,
      duration: duration,
    });
  }

  /**
   * Muestra un mensaje tipo info en la posición de posX y posY.
   * Por defecto top right.
   *
   * @param message Mensaje a mostrar
   * @param posY MatSnackBarVerticalPosition ('top' | 'bottom').
   * @param posX MatSnackBarHorizontalPosition ('start' | 'center' | 'end' | 'left' | 'right').
   * @param duration Duración en milisegundos.
   */
  info(
    message: string,
    posY: MatSnackBarVerticalPosition = 'top',
    posX: MatSnackBarHorizontalPosition = 'right',
    duration = 3000,
  ): void {
    this.matSnackBar.open(message, 'X', {
      panelClass: ['snackbar-info'],
      verticalPosition: posY,
      horizontalPosition: posX,
      duration: duration,
    });
  }

  /**
   * Muestra un mensaje tipo warning en la posición de posX y posY.
   * Por defecto top right.
   *
   * @param message Mensaje a mostrar
   * @param posY MatSnackBarVerticalPosition ('top' | 'bottom').
   * @param posX MatSnackBarHorizontalPosition ('start' | 'center' | 'end' | 'left' | 'right').
   * @param duration Duración en milisegundos.
   */
  warning(
    message: string,
    posY: MatSnackBarVerticalPosition = 'top',
    posX: MatSnackBarHorizontalPosition = 'right',
    duration = 3000,
  ): void {
    this.matSnackBar.open(message, 'X', {
      panelClass: ['snackbar-warning'],
      verticalPosition: posY,
      horizontalPosition: posX,
      duration: duration,
    });
  }

  /**
   * Muestra un mensaje tipo error en la posición de posX y posY.
   * Por defecto top right.
   *
   * @param message Mensaje a mostrar
   * @param posY MatSnackBarVerticalPosition ('top' | 'bottom').
   * @param posX MatSnackBarHorizontalPosition ('start' | 'center' | 'end' | 'left' | 'right').
   * @param duration Duración en milisegundos.
   */
  error(
    message: string,
    posY: MatSnackBarVerticalPosition = 'top',
    posX: MatSnackBarHorizontalPosition = 'right',
    duration = 3000,
  ): void {
    this.matSnackBar.open(message, 'X', {
      panelClass: ['snackbar-danger'],
      verticalPosition: posY,
      horizontalPosition: posX,
      duration: duration,
    });
  }
}
