import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import ColorPicker, { ColorPickerOptions } from '@thednp/color-picker';
import { BadRequest } from '../../../../../core/models/bad-request';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';

/* eslint-disable  @typescript-eslint/no-explicit-any */
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
  standalone: true,
  imports: [FormsModule, FieldErrorComponent],
})
export class FormColorPickerComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  badRequest = input.required<BadRequest | undefined>();
  form = input.required<FormGroup>();
  submitted = input.required<boolean>();
  fieldName = input.required<string>();
  label = input.required<string>();
  id = input(Math.random().toString());
  readonly = input(true);
  options = input<Partial<ColorPickerOptions>>();
  dataFormat = input<'hex' | 'rgb' | 'hsl' | 'hsv'>('hex');

  @ViewChild('colorPicker') elementRef!: ElementRef;

  private colorPicker!: ColorPicker;

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
    if (value !== this.value) {
      this.value = value || '';
      this.onChange(this.value);
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: any): void {
    this.onChange(value);
  }

  private updateColorPicker(value: string): void {
    if (!this.colorPicker) {
      return;
    }

    this.colorPicker.color = new ColorPicker.Color(value);
    this.colorPicker.update();
  }
}
