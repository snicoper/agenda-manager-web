import { IdentityDocumentType } from './identity-document-type.enum';

/**
 * Tipo que permite valores nulos en el tipo de documento de identidad.
 * Se usa principalmente en formularios para representar un estado no seleccionado.
 */
export type IdentityDocumentTypeNullable = IdentityDocumentType | null;
