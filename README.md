# Agenda Manager Web

Mira, he puesto el fondo como color de las tablas

```scss
// Clases base para contenido dentro de blades.
.blade-content-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--mat-table-background-color);

  // Título del blade
  .blade-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  // Contenedor del formulario o contenido principal.
  .blade-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  // Acciones (botones, etc)
  .blade-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 1rem;
  }
}
```

Me gusta el cambio de color, pero mehh, como que hay mucho padding en la pagina (blade), no se como lo ves tu
