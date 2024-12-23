import { DateTimeProvider } from '../../../types/datetime-provider.type';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expires: DateTimeProvider;
}
