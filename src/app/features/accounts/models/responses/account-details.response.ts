import { DateTime } from 'luxon';
import { IdentityDocumentType } from '../../../../core/modules/users/identity-document/identity-document-type.enum';

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
  createdAt: DateTime;
  phoneNumber?: PhoneNumber;
  address?: Address;
  identityDocument?: IdentityDocument;
}
