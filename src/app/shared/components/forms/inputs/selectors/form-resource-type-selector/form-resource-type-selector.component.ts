/* eslint-disable  @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../../../core/forms/models/form-state.model';
import { SelectOnFocusDirective } from '../../../../../directives/select-on-focus.directive';
import { FieldErrorComponent } from '../../../errors/field-error/field-error.component';
import { FormIconPosition } from '../../../types/form-icon-position.enum';
import { SelectableResourceType } from './models/selectable-resource-type.model';
import { ResourceTypeSelectorService } from './services/resource-type-selector.service';

@Component({
  selector: 'am-form-resource-type-selector',
  imports: [
    FormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FieldErrorComponent,
    SelectOnFocusDirective,
  ],
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
  readonly placeholder = input('');
  readonly icon = input('');
  readonly formIconPosition = input(FormIconPosition.prefix);

  readonly value = signal<SelectableResourceType | null>(null);
  readonly resourceTypes = signal<SelectableResourceType[]>([]);
  readonly isLoading = signal(false);
  readonly isDisabled = signal(false);
  readonly iconPositions = FormIconPosition;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `resource-type-selector-field-${(FormResourceTypeSelectorComponent.nextId += 1)}`;

  ngOnInit(): void {
    this.loadResourceTypes();
  }

  onChange = (_: SelectableResourceType): void => {};
  onTouch: () => void = () => {};

  displayFn = (resourceType: SelectableResourceType): string => {
    return resourceType?.name ?? '';
  };

  writeValue(value: SelectableResourceType): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: SelectableResourceType) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleSelectionChange(item: SelectableResourceType): void {
    this.value.set(item);
    this.onChange(this.value() as SelectableResourceType);
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
