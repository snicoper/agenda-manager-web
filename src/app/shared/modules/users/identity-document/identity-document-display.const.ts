import { IdentityDocumentType } from './identity-document-type.enum';

export const IdentityDocumentDisplayInfo: Record<IdentityDocumentType, { code: string; description: string }> = {
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

export const IdentityDocumentOptions = Object.entries(IdentityDocumentDisplayInfo).map(([type, info]) => ({
  value: Number(type),
  code: info.code,
  description: info.description,
})) as { value: IdentityDocumentType; code: string; description: string }[];

export const IdentityDocumentUtils = {
  getCodeByType: (type: IdentityDocumentType): string => IdentityDocumentDisplayInfo[type]?.code ?? '',

  getDescriptionByType: (type: IdentityDocumentType): string => IdentityDocumentDisplayInfo[type]?.description ?? '',

  isValidType: (type: IdentityDocumentType): boolean => type in IdentityDocumentType,
} as const;
