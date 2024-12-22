import { DateTimeProvider } from '../../../core/types/datetime-provider.type';

export interface AccountResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  isCollaborator: boolean;
  dateJoined: DateTimeProvider;
}
