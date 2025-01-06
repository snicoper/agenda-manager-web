/* eslint-disable  @typescript-eslint/no-empty-function */
import { Component, forwardRef, inject, input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../../../core/forms/models/form-state.model';
import { FieldErrorComponent } from '../../../errors/field-error/field-error.component';
import { SelectableResourceType } from './models/selectable-resource-type.model';
import { ResourceTypeSelectorService } from './services/resource-type-selector.service';

@Component({
  selector: 'am-form-resource-type-selector',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, FieldErrorComponent],
  templateUrl: './form-resource-type-selector.component.html',
  styleUrl: './form-resource-type-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormResourceTypeSelectorComponent),
      multi: true,
    },
    ResourceTypeSelectorService,
  ],
})
export class FormResourceTypeSelectorComponent implements ControlValueAccessor, OnInit {
  private readonly apiService = inject(ResourceTypeSelectorService);

  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();

  readonly resourceTypes = signal<SelectableResourceType[]>([]);
  readonly isLoading = signal(false);
  readonly value = signal<string[]>([]);
  readonly isDisabled = signal(false);

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `resource-type-selector-field-${(FormResourceTypeSelectorComponent.nextId += 1)}`;

  ngOnInit(): void {
    this.loadResourceTypes();
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

  private loadResourceTypes(): void {
    this.isLoading.set(true);
    this.apiService
      .getAllResourceTypes()
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => this.resourceTypes.set(response),
      });
  }
}
