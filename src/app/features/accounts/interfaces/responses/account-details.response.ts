import { DateTimeProvider } from '../../../../core/modules/i18n/types/datetime-provider.type';
import { IdentityDocumentType } from '../../../../shared/modules/users/identity-document/identity-document-type.enum';

export interface PhoneNumber {
  countryCode?: string;
  number?: string;
}

export interface Address {
  street?: string;
  city?: string;
  country?: string;
  state?: string;
  postalCode?: string;
}

export interface IdentityDocument {
  number?: string;
  countryCode?: string;
  type?: IdentityDocumentType;
}

export interface AccountDetailsResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailConfirmed: boolean;
  isActive: boolean;
  isCollaborator: boolean;
  createdAt: DateTimeProvider;
  phoneNumber?: PhoneNumber;
  address?: Address;
  identityDocument?: IdentityDocument;
}
