import { IdentityDocumentTypeNullable } from '../../../../../modules/users/identity-document/identity-document.type';

export interface FormIdentityDocumentField {
  number: string;
  countryCode: string;
  type: IdentityDocumentTypeNullable;
}
