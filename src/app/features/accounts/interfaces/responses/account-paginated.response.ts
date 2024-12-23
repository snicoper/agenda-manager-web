import { DateTimeProvider } from '../../../../core/types/datetime-provider.type';

export interface AccountPaginatedResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  isCollaborator: boolean;
  dateJoined: DateTimeProvider;
}
