import { Injectable } from '@angular/core';

/** Configuración inicial de la aplicación. */
@Injectable()
export class AppConfig {
  load(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}
