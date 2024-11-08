import { LuxonDateAdapter } from '@angular/material-luxon-adapter';

export class CustomLuxonDateAdapter extends LuxonDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
