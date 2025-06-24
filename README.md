# Agenda Manager - SPA

## 🌟 Descripción

Agenda Manager SPA es la aplicación frontend desarrollada en **Angular** para la gestión de citas y recursos. Se comunica con la **Agenda Manager API** para proporcionar una interfaz intuitiva y eficiente para la administración de calendarios, usuarios y servicios.

## 🔎 Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **RxJS** - Programación reactiva
- **Angular Material** - UI Components
- **Bootstrap 5.3.3** - Uso exclusivo de Flexbox (y Grid en el futuro)
- **Luxon** - Manejo de fechas y zonas horarias
- **jwt-decode** - Decodificación de tokens JWT
- **i18n-iso-countries** - Manejo de códigos de países
- **libphonenumber-js** - Validación de números de teléfono

## 🛠️ Estructura del Proyecto

El proyecto sigue una organización modular y escalable:

```bash
📦 src/
 ┣ 📂 app/                # Configuración principal de la aplicación
 ┃ ┣ 📂 core/             # Servicios y funcionalidades compartidas
 ┃ ┣ 📂 features/         # Módulos y componentes específicos por funcionalidad
 ┃ ┣ 📂 shared/           # Componentes y utilidades reutilizables
 ┃ ┣ 📜 app.component.ts  # Componente principal
 ┃ ┣ 📜 app.routes.ts     # Configuración de rutas
 ┃ ┣ 📜 app.config.ts     # Configuración de la aplicación
 ┣ 📂 environments/       # Configuraciones de entorno
 ┣ 📂 styles/             # Estilos globales y SCSS
 ┣ 📜 index.html          # Archivo principal HTML
 ┣ 📜 main.ts             # Punto de entrada de la aplicación
```

## 🔧 Configuración y Ejecución

Para correr la SPA localmente:

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/snicoper/agenda-manager-web.git
   cd agenda-manager-web
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Ejecutar la aplicación en modo desarrollo:

   ```bash
   npm start
   ```

   Esto levantará la aplicación en `http://localhost:4200/`

4. Ejecutar la SPA con Docker:

   ```bash
   docker-compose up -d
   ```

   Esto iniciará el contenedor con **NGINX** y expondrá la SPA en `http://localhost`

5. Para detener el contenedor:

   ```bash
   docker-compose down
   ```

## 💌 Enlaces Relacionados

- **API:** [Agenda Manager API](https://github.com/snicoper/agenda-manager-api)
- **Documentación:** [Agenda Manager Docs](https://github.com/snicoper/agenda-manager-docs)
- **Colección Bruno:** [Agenda Manager Bruno](https://github.com/snicoper/agenda-manager-bruno)

## ✅ Roadmap y Mejoras Pendientes

- [ ] Optimizar el rendimiento de carga inicial
- [ ] Mejorar el soporte para internacionalización (i18n)
- [ ] Implementar testing automatizado con Karma/Jasmine
