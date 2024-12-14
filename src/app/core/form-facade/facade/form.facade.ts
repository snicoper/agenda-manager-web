import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Observable, Subscription } from 'rxjs';
import { FormState } from '../../models/form-state';
import { FormConfig } from '../models/form-config.interface';
import { FormFacadeResult } from '../models/form-facade-result.interface';
import { FormFieldConfig } from '../models/form-field-config.interface';

@Injectable({ providedIn: 'root' })
export class FormFacade {
  private readonly formBuilder = inject(FormBuilder);

  createForm<T extends Record<string, unknown>>(config: FormConfig<T>): FormFacadeResult<T> {
    const formGroup = this.buildFormGroup(config);
    const formState = signal<FormState>({
      form: formGroup,
      badRequest: undefined,
      isSubmitted: false,
      isLoading: false,
    });

    const isFormValid = signal(false);
    formGroup.statusChanges.subscribe(() => {
      isFormValid.set(formGroup.valid);
    });

    return {
      // Accesores básicos
      form: formGroup,
      state: formState,

      // Estado computado
      isValid: computed(() => {
        const state = formState();

        return !state.isLoading && isFormValid();
      }),
      isDirty: computed(() => formGroup.dirty),
      isPristine: computed(() => formGroup.pristine),

      // Métodos de control
      submit: (submitFn: () => Observable<unknown>) => this.handleSubmit(submitFn, formState, config),

      reset: () => this.resetForm(formGroup, formState),

      markAsTouched: () => formGroup.markAllAsTouched(),

      // Helpers para campos
      getFieldValue: (fieldName: keyof T) => formGroup.get(fieldName as string)?.value,

      setFieldValue: (fieldName: keyof T, value: unknown) => formGroup.get(fieldName as string)?.setValue(value),

      getFieldErrors: (fieldName: keyof T) => formGroup.get(fieldName as string)?.errors,

      getFieldConfig: (fieldName: keyof T) => config.fields[fieldName].component,

      patchValue: (value: Partial<T>) => formGroup.patchValue(value),

      setValue: (value: T) => formGroup.setValue(value),
    };
  }

  private buildFormGroup<T extends Record<string, unknown>>(config: FormConfig<T>): FormGroup {
    const group: Record<string, unknown> = {};

    for (const [key, field] of Object.entries(config.fields) as [string, FormFieldConfig<unknown>][]) {
      group[key] = [field.value, field.validators];
    }

    return this.formBuilder.group(group, {
      validators: config.validators,
    });
  }

  private handleSubmit<T extends Record<string, unknown>>(
    submitFn: () => Observable<unknown>,
    state: WritableSignal<FormState>,
    config: FormConfig<T>,
  ): Subscription {
    state.update((current) => ({
      ...current,
      isSubmitted: true,
    }));

    if (!state().form.valid) {
      state().form.markAllAsTouched();

      return new Subscription();
    }

    state.update((current) => ({
      ...current,
      isLoading: true,
      badRequest: undefined,
    }));

    return submitFn()
      .pipe(
        finalize(() => {
          state.update((current) => ({
            ...current,
            isLoading: false,
          }));
        }),
      )
      .subscribe({
        next: () => {
          config.onSuccess?.();
          this.resetFormState(state);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.BadRequest || error.status === HttpStatusCode.Conflict) {
            state.update((current) => ({
              ...current,
              badRequest: error.error,
            }));
          }

          config.onError?.(error);
        },
      });
  }

  private resetForm(form: FormGroup, state: WritableSignal<FormState>): void {
    form.reset();
    this.resetFormState(state);
  }

  private resetFormState(state: WritableSignal<FormState>): void {
    state.update((current) => ({
      ...current,
      isSubmitted: false,
      badRequest: undefined,
    }));
  }
}
