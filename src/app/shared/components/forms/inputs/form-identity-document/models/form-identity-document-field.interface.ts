import { IdentityDocumentTypeNullable } from '../../../../../modules/identity-document/identity-document.type';

export interface FormIdentityDocumentField {
  number: string;
  countryCode: string;
  type: IdentityDocumentTypeNullable;
}
