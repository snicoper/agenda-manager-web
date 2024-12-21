import { DateTimeProvider } from '../../../core/types/datetime-provider.type';
import { IdentityDocumentType } from '../types/identity-document.type';

export interface PhoneNumber {
  countryCode: string;
  number: string;
}

export interface Address {
  street: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
}

export interface IdentityDocument {
  number: string;
  countryCode: string;
  type: IdentityDocumentType;
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
