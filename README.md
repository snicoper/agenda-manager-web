# Agenda Manager Web

Tengo una duda con Angular, tengo un componente `alert-component` y esto es el html y scss

```html
@if (show()) {
  <div
    class="alert alert-container"
    [attr.aria-label]="'Alert: ' + type()"
    [attr.aria-live]="type() === 'error' ? 'assertive' : 'polite'"
    [ngClass]="{
      'alert-success': type() === 'success',
      'alert-error': type() === 'error',
      'alert-warning': type() === 'warning',
      'alert-info': type() === 'info',
    }"
    role="alert"
  >
    @if (showIcon()) {
      <div class="alert-icon">
        @switch (type()) {
          @case ("success") {
            <mat-icon>check_circle</mat-icon>
          }
          @case ("error") {
            <mat-icon>error</mat-icon>
          }
          @case ("warning") {
            <mat-icon>warning</mat-icon>
          }
          @case ("info") {
            <mat-icon>info</mat-icon>
          }
        }
      </div>
    }

    <ng-content class="alert-content" />

    @if (dismissible()) {
      <mat-icon class="alert-close" (click)="handleClose()">close</mat-icon>
    }
  </div>
}
```

Y este el estilo

```scss
:host {
  display: block;
}

.alert-container {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.375rem;
  display: flex;
  align-items: start;
  gap: 0.75rem;

  .alert-content {
    flex: 1;
    position: relative;
    top: 50px;
    color: red !important;
  }

  .alert-close {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1.25rem;
    line-height: 1;
    opacity: 0.5;
    transition: opacity 0.15s;

    &:hover {
      opacity: 1;
    }
  }
}
```

El `.alert-content` lo tengo exagerado para notar diferencias, el problema es que no afecta el css que escribo
