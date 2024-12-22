import { Directive, HostListener } from '@angular/core';

/**
 * Directiva que selecciona automáticamente todo el texto de un campo de entrada cuando recibe el foco.
 *
 * @example
 * ```html
 * <input amSelectOnFocus [(ngModel)]="value">
 * ```
 * o
 * ```html
 * <input amSelectOnFocus [formControl]="control">
 * ```
 *
 * @usageNotes
 * Esta directiva mejora la experiencia de usuario en campos de texto seleccionando
 * automáticamente todo el contenido cuando el usuario hace foco en el campo.
 * Es especialmente útil en campos de búsqueda o filtrado como autocomplete.
 *
 * Compatible con:
 * - Inputs de texto estándar
 * - Material Input
 * - Campos con ngModel
 * - Campos con FormControl
 */
@Directive({ selector: '[amSelectOnFocus]' })
export class SelectOnFocusDirective {
  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent): void {
    const element = event.target as HTMLInputElement;
    element.select();
  }
}
