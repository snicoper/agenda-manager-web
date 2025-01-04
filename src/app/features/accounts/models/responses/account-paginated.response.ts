import { DateTime } from 'luxon';

export interface AccountPaginatedResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  dateJoined: DateTime | null;
}
