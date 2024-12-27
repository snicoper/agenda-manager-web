import { Component } from '@angular/core';
import { logInfo } from '../../core/errors/logger/logger.co';

@Component({
  selector: 'am-pruebas',
  imports: [],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.scss',
})
export class PruebasComponent {
  constructor() {
    logInfo('PruebasComponent constructor');
  }
}
