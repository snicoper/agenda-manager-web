# Agenda Manager Web

## Estructura de Carpetas en Angular

## Core

La carpeta `core` contiene elementos fundamentales y singleton de la aplicación:

- **Servicios Singleton**: Servicios que deben tener una única instancia (auth, user service)
- **Guards Globales**: Protección de rutas a nivel aplicación
- **Interceptores**: Manejo de peticiones HTTP
- **Configuración Global**: Configuraciones base de la aplicación
- **Estado Global**: Gestión del estado que afecta a toda la app

*El core representa la infraestructura base y no debería importar de features o shared.*

## Features

Contiene los módulos específicos de la aplicación, cada uno con su propia estructura:

```shell
features/
  feature-name/
    components/    # Componentes específicos de la feature
    contracts/     # Contratos/interfaces específicos
    models/        # Modelos de datos (requests/responses)
    pages/         # Componentes página/rutas
    services/      # Servicios específicos de la feature
```

*Cada feature es independiente y puede importar de shared, pero no de otras features.*

## Shared

Contiene elementos reutilizables en toda la aplicación:

- **Components**: Componentes UI reutilizables
- **Directives**: Directivas compartidas
- **Pipes**: Pipes reutilizables
- **Models**: Modelos/interfaces compartidos
- **Utils**: Utilidades y helpers
- **Services**: Servicios no singleton reutilizables

*Shared no debe tener dependencias de features o core.*

## Data (Opcional)

Si se implementa, contiene la capa de acceso a datos:

- **Repositories**: Implementación del patrón repository
- **Services**: Servicios de acceso a datos
- **Models**: Modelos de datos/DTOs
- **Mappers**: Transformación de datos
- **API**: Configuración y clientes HTTP

*Data solo debería ser importado por features o core, nunca por shared.*

### Reglas de Dependencias

```shell
Data → ← Core
  ↑      ↑
Features ← Shared
```

- Core puede importar de Data
- Features puede importar de Shared, Core y Data
- Shared no importa de ninguno
- Data puede importar de Core para configuración

### Consideraciones

- Los componentes en Shared deben ser verdaderamente reutilizables
- Core debe mantenerse lo más pequeño posible
- Features deben ser independientes entre sí
- Data es opcional y depende de la complejidad del proyecto

---

Te pongo uno de cada para que tengas contexto

```typescript
export enum AppointmentConfirmationRequirementStrategy {
  Require = 1,
  AutoAccept = 2,
}
```

```typescript
import { AppointmentConfirmationRequirementStrategy } from '../enums/appointment-confirmation-requirement-strategy.enum';

export const AppointmentConfirmationRequirementInfo: Record<
  AppointmentConfirmationRequirementStrategy,
  { code: string; description: string }
> = {
  [AppointmentConfirmationRequirementStrategy.Require]: {
    code: 'Require',
    description: 'Requiere confirmación',
  },
  [AppointmentConfirmationRequirementStrategy.AutoAccept]: {
    code: 'AutoAccept',
    description: 'Auto aceptar',
  },
} as const;

export const AppointmentConfirmationRequirementOptions = Object.entries(AppointmentConfirmationRequirementInfo).map(
  ([type, info]) => ({
    value: Number(type),
    code: info.code,
    description: info.description,
  }),
) as { value: AppointmentConfirmationRequirementStrategy; code: string; description: string }[];

export const AppointmentConfirmationRequirementUtils = {
  getCodeByType: (type: AppointmentConfirmationRequirementStrategy): string =>
    AppointmentConfirmationRequirementInfo[type]?.code ?? '',

  getDescriptionByType: (type: AppointmentConfirmationRequirementStrategy): string =>
    AppointmentConfirmationRequirementInfo[type]?.description ?? '',

  isValidType: (type: AppointmentConfirmationRequirementStrategy): boolean =>
    type in AppointmentConfirmationRequirementStrategy,
} as const;
```

Ahora dime, en un purismo, donde iría cada cosa?
