export enum IdentityDocumentType {
  NationalId = 1,
  ForeignerId = 2,
  Passport = 3,
  ResidencePermit = 4,
  DriversLicense = 5,
  HealthCard = 6,
  SocialSecurityNumber = 7,
}

/**
 * Tipo que permite valores nulos en el tipo de documento de identidad.
 * Se usa principalmente en formularios para representar un estado no seleccionado.
 */
export type IdentityDocumentTypeNullable = IdentityDocumentType | null;

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
};

export const IdentityDocumentOptions = Object.entries(IdentityDocumentDisplayInfo).map(([type, info]) => ({
  value: Number(type),
  code: info.code,
  description: info.description,
}));

export const IdentityDocumentUtils = {
  getCodeByType: (type: IdentityDocumentType): string => IdentityDocumentDisplayInfo[type]?.code ?? '',

  getDescriptionByType: (type: IdentityDocumentType): string => IdentityDocumentDisplayInfo[type]?.description ?? '',

  isValidType: (type: IdentityDocumentType): boolean => type in IdentityDocumentType,
} as const;
