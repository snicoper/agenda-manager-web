/* eslint-disable  @typescript-eslint/no-empty-function */
import { Component, forwardRef, inject, input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../../../core/forms/models/form-state.model';
import { FieldErrorComponent } from '../../../errors/field-error/field-error.component';
import { SelectableRole } from './models/selectable-role.model';
import { RoleSelectorApiService } from './services/role-selector-api.service';

@Component({
  selector: 'am-form-role-selector',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, FieldErrorComponent],
  templateUrl: './form-role-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRoleSelectorComponent),
      multi: true,
    },
    RoleSelectorApiService,
  ],
})
export class FormRoleSelectorComponent implements ControlValueAccessor, OnInit {
  private readonly apiService = inject(RoleSelectorApiService);

  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();

  readonly availableRoles = signal<SelectableRole[]>([]);
  readonly isLoading = signal(false);
  readonly value = signal<string[]>([]);
  readonly isDisabled = signal(false);

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `role-selector-field-${(FormRoleSelectorComponent.nextId += 1)}`;

  ngOnInit(): void {
    this.loadRoles();
  }

  onChange = (_: string[]): void => {};
  onTouch: () => void = () => {};

  writeValue(value: string[]): void {
    this.value.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleSelectionChange(selectedIds: string[]): void {
    this.value.set(selectedIds);
    this.onChange(this.value());
    this.onTouch();
  }

  private loadRoles(): void {
    this.isLoading.set(true);
    this.apiService
      .getAllRoles()
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (roles) => this.availableRoles.set(roles),
      });
  }
}
