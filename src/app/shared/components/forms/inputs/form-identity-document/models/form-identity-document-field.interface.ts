import { IdentityDocumentType } from '../../../../../../features/accounts/types/identity-document.type';

export interface FormIdentityDocumentField {
  number?: string;
  countryCode?: string;
  type?: IdentityDocumentType;
}
