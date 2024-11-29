import { Pipe, PipeTransform } from '@angular/core';

/**
 * Devuelve un icon en función del valor booleano.
 * Para tipos booleans, retorna el HTML con un icono según el valor.
 *
 * @example:
 *  <td [innerHTML]="employee.is_staff | boolToIcon"></td>
 */
@Pipe({ name: 'boolToIcon' })
export class BoolToIconPipe implements PipeTransform {
  transform(value: boolean | undefined): string {
    if (value) {
      return '<span class="material-icons text-success">check_circle</span>';
    }

    return '<span class="material-icons text-danger">cancel</span>';
  }
}
