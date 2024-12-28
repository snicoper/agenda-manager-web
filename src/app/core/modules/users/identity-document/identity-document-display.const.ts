import { BaseEnumInfo } from '../../../utils/enums/enum-utils.interface';
import { EnumUtils } from '../../../utils/enums/enum.utils';
import { IdentityDocumentType } from './identity-document-type.enum';

export const IdentityDocumentDisplayInfo: Record<IdentityDocumentType, BaseEnumInfo> = {
  [IdentityDocumentType.NationalId]: {
    code: 'DNI',
    description: 'Documento Nacional de Identidad',
  },
  [IdentityDocumentType.ForeignerId]: {
    code: 'NIE',
    description: 'Número de Identidad de Extranjero',
  },
  [IdentityDocumentType.Passport]: {
    code: 'PASSPORT',
    description: 'Pasaporte',
  },
  [IdentityDocumentType.ResidencePermit]: {
    code: 'TIE',
    description: 'Tarjeta de Identidad de Extranjero',
  },
  [IdentityDocumentType.DriversLicense]: {
    code: 'DL',
    description: 'Permiso de Conducir',
  },
  [IdentityDocumentType.HealthCard]: {
    code: 'TSI',
    description: 'Tarjeta Sanitaria Individual',
  },
  [IdentityDocumentType.SocialSecurityNumber]: {
    code: 'NSS',
    description: 'Número de Seguridad Social',
  },
} as const;

export const IdentityDocumentUtils = new EnumUtils<IdentityDocumentType, BaseEnumInfo>(IdentityDocumentDisplayInfo);
