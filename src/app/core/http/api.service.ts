import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment } from '../../core/config/app-environment';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService {
  protected readonly http = inject(HttpClient);

  protected readonly baseUrl = AppEnvironment.baseApiUrl;
}
