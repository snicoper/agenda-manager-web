import { Component, forwardRef, inject, input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize, take } from 'rxjs';
import { SnackBarService } from '../../../../../../core/services/snackbar.service';
import { FieldErrorComponent } from '../../../errors/field-error/field-error.component';
import { SelectableRole } from './interfaces/selectable-role.interface';
import { RoleSelectorApiService } from './services/role-selector-api.service';
import { FormState } from '../../../../../../core/forms/interfaces/form-state.interface';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-role-selector',
  templateUrl: './form-role-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRoleSelectorComponent),
      multi: true,
    },
    RoleSelectorApiService,
  ],
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, FieldErrorComponent],
})
export class FormRoleSelectorComponent implements ControlValueAccessor, OnInit {
  private readonly apiService = inject(RoleSelectorApiService);
  private readonly snackBarService = inject(SnackBarService);

  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();

  availableRoles: SelectableRole[] = [];
  isLoading = false;

  value: string[] = [];
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `address-field-${(FormRoleSelectorComponent.nextId += 1)}`;

  ngOnInit(): void {
    this.loadRoles();
  }

  onChange = (_: string[]): void => {};
  onTouch: () => void = () => {};

  writeValue(value: string[]): void {
    this.value = value || [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onSelectionChange(selectedIds: string[]): void {
    this.value = selectedIds;
    this.onChange(this.value);
    this.onTouch();
  }

  private loadRoles(): void {
    this.isLoading = true;
    this.apiService
      .getAllRoles()
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: (roles) => (this.availableRoles = roles),
        error: () => this.snackBarService.error('Error al cargar los roles'),
      });
  }
}
