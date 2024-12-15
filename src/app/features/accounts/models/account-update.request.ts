import { IdentityDocumentType } from '../types/identity-document.type';

export interface PhoneNumber {
  number: string;
  countryCode: string;
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

export interface AccountUpdateRequest {
  userId: string;
  firstName: string;
  lastName: string;
  phone: PhoneNumber;
  address: Address;
  identityDocument: IdentityDocument;
}
