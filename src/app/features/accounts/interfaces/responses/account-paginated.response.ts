import { DateTimeProvider } from '../../../../core/modules/i18n/types/datetime-provider.type';

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
