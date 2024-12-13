import { DateTimeProvider } from '../../../core/types/datetime-provider.type';
import { IdentityDocumentType } from '../types/identity-document.type';

export interface AccountDetailsResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  phoneNumberCountryCode?: string;
  addressStreet?: string;
  addressCity?: string;
  addressCountry?: string;
  addressState?: string;
  addressPostalCode?: string;
  identityDocument?: string;
  identityDocumentType?: IdentityDocumentType;
  isEmailConfirmed: boolean;
  isActive: boolean;
  isCollaborator: boolean;
  createdAt: DateTimeProvider;
}
