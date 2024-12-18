export enum IdentityDocumentType {
  NationalId = 1,
  ForeignerId = 2,
  Passport = 3,
  ResidencePermit = 4,
  DriversLicense = 5,
  HealthCard = 6,
  SocialSecurityNumber = 7,
}

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
