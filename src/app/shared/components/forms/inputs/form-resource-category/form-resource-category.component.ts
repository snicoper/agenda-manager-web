import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { ResourceCategoryUtils } from '../../../../../core/modules/resource-management/resource-category/resource-category.const';
import { ResourceCategory } from '../../../../../core/modules/resource-management/resource-category/resource-category.enum';
import { SelectOnFocusDirective } from '../../../../directives/select-on-focus.directive';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormIconPosition } from '../../types/form-icon-position.enum';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-resource-category',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatAutocompleteModule,
    FieldErrorComponent,
    SelectOnFocusDirective,
  ],
  templateUrl: './form-resource-category.component.html',
  styleUrl: './form-resource-category.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormResourceCategoryComponent),
      multi: true,
    },
  ],
})
export class FormResourceCategoryComponent implements ControlValueAccessor {
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly readonly = input(false);
  readonly placeholder = input('');
  readonly icon = input('');
  readonly formIconPosition = input(FormIconPosition.prefix);

  readonly value = signal<ResourceCategory>({} as ResourceCategory);
  readonly isDisabled = signal(false);
  readonly iconPositions = FormIconPosition;
  readonly resourceCategoryUtils = ResourceCategoryUtils;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `form-resource-category-${(FormResourceCategoryComponent.nextId += 1)}`;

  onChange = (_: ResourceCategory): void => {};

  onTouch = (): void => {};

  displayFn = (value: number): string => {
    const option = this.resourceCategoryUtils.getOptions().find((opt) => opt.value === value);

    return option ? option.description : '';
  };

  writeValue(value: ResourceCategory): void {
    this.value.set(value ?? ({} as ResourceCategory));
  }

  registerOnChange(fn: (value: ResourceCategory) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onChangeValue(value: ResourceCategory): void {
    this.onChange(value);
    this.onTouch();
  }
}
