import { DateTimeProvider } from '../../../../i18n/types/datetime-provider.type';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expires: DateTimeProvider;
}
