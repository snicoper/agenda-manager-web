# Agenda Manager Web

```shell
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── token.service.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       └── token.model.ts
│   │   │
│   │   ├── interceptors/        # Interceptors separados por responsabilidad
│   │   │   ├── auth/
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── error/
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── loader/
│   │   │   │   └── loader.interceptor.ts  # Para mostrar/ocultar spinners
│   │   │   └── index.ts         # Barrel file para exportar todos los interceptors
│   │   │
│   │   ├── http/
│   │   │   └── api.service.ts
│   │   │
│   │   ├── services/           # Otros servicios core no relacionados con auth
│   │   │   ├── logger.service.ts
│   │   │   └── storage.service.ts
│   │   │
│   │   └── core.module.ts  # Módulo singleton con servicios core
│   │
│   ├── shared/                 # Componentes, pipes, directivas compartidas
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── loading/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── shared.module.ts
│   │
│   ├── features/              # Módulos de características
│   │   ├── auth/             # Módulo de autenticación
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── components/
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── dashboard/        # Módulo de dashboard
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── dashboard.module.ts
│   │   │
│   │   └── users/           # Módulo de usuarios
│   │       ├── pages/
│   │       ├── components/
│   │       ├── services/
│   │       └── users.module.ts
│   │
│   ├── layouts/             # Layouts de la aplicación
│   │   ├── main-layout/
│   │   └── auth-layout/
│   │
│   └── config/             # Configuraciones globales
│       ├── constants/
│       ├── interfaces/
│       └── environment.ts
│
├── assets/
│   ├── images/
│   ├── styles/
│   │   ├── base/
│   │   ├── components/
│   │   └── themes/
│   └── i18n/               # Archivos de internacionalización
│
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```
