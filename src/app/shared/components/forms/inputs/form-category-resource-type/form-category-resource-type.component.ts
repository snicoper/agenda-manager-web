import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormState } from '../../../../../core/forms/interfaces/form-state.interface';
import { ResourceCategoryUtils } from '../../../../../core/modules/resource-management/resource-category/resource-category.const';
import { ResourceCategory } from '../../../../../core/modules/resource-management/resource-category/resource-category.enum';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormIconPosition } from '../../types/form-icon-position.enum';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-category-resource-type',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIcon, MatAutocompleteModule, FieldErrorComponent],
  templateUrl: './form-category-resource-type.component.html',
  styleUrl: './form-category-resource-type.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCategoryResourceTypeComponent),
      multi: true,
    },
  ],
})
export class FormCategoryResourceTypeComponent implements ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  readonly = input(false);
  placeholder = input('');
  icon = input('');
  formIconPosition = input(FormIconPosition.prefix);

  readonly iconPositions = FormIconPosition;
  readonly resourceCategoryUtils = ResourceCategoryUtils;

  value!: ResourceCategory;
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `form-category-resource-type-${(FormCategoryResourceTypeComponent.nextId += 1)}`;

  onChange = (_: ResourceCategory): void => {};

  onTouch = (): void => {};

  writeValue(value: ResourceCategory): void {
    this.value = value;
  }

  registerOnChange(fn: (value: ResourceCategory) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: ResourceCategory): void {
    this.onChange(value);
    this.onTouch();
  }
}
