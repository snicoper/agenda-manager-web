import { DateTime } from 'luxon';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expires: DateTime;
}
