import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import ColorPicker, { ColorPickerOptions } from '@thednp/color-picker';
import { FormState } from '../../../../../core/models/form-state';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';

/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-color-picker',
  templateUrl: './form-color-picker.component.html',
  styleUrl: './form-color-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormColorPickerComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, FieldErrorComponent],
})
export class FormColorPickerComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  readonly = input(true);
  options = input<Partial<ColorPickerOptions>>();
  dataFormat = input<'hex' | 'rgb' | 'hsl' | 'hsv'>('hex');

  @ViewChild('colorPicker') elementRef!: ElementRef;

  private colorPicker!: ColorPicker;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `color-picker-field-${(FormColorPickerComponent.nextId += 1)}`;

  value!: string;
  isDisabled = false;

  ngAfterViewInit(): void {
    this.colorPicker = new ColorPicker(this.elementRef.nativeElement, this.options());
    this.updateColorPicker(this.value);

    // No he encontrado otra manera de actualizar el value.
    setInterval(() => {
      this.value = this.colorPicker.value;
      this.onChange(this.value);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.colorPicker.dispose();
  }

  onChange = (_: string): void => {};

  onTouch = (): void => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: string): void {
    this.onChange(value);
    this.onTouch();
  }

  private updateColorPicker(value: string): void {
    if (!this.colorPicker) {
      return;
    }

    this.colorPicker.color = new ColorPicker.Color(value);
    this.colorPicker.update();
  }
}
