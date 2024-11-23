import { TimeProvider } from '../../types/time-provider.type';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expires: TimeProvider;
}
