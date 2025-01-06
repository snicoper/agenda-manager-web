/* eslint-disable  @typescript-eslint/no-empty-function */
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import ColorPicker, { ColorPickerOptions } from '@thednp/color-picker';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';

@Component({
  selector: 'am-form-color-picker',
  imports: [FormsModule, FieldErrorComponent],
  templateUrl: './form-color-picker.component.html',
  styleUrl: './form-color-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormColorPickerComponent),
      multi: true,
    },
  ],
})
export class FormColorPickerComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly readonly = input(true);
  readonly options = input<Partial<ColorPickerOptions>>();
  readonly dataFormat = input<'hex' | 'rgb' | 'hsl' | 'hsv'>('hex');

  @ViewChild('colorPicker') readonly elementRef!: ElementRef;

  readonly value = signal('');
  readonly isDisabled = signal(false);

  private colorPicker!: ColorPicker;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `color-picker-field-${(FormColorPickerComponent.nextId += 1)}`;

  ngAfterViewInit(): void {
    this.colorPicker = new ColorPicker(this.elementRef.nativeElement, this.options());
    this.updateColorPicker(this.value());

    // No he encontrado otra manera de actualizar el value.
    setInterval(() => {
      this.value.set(this.colorPicker.value);
      this.onChange(this.value());
    }, 1000);
  }

  ngOnDestroy(): void {
    this.colorPicker.dispose();
  }

  onChange = (_: string): void => {};

  onTouch = (): void => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
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
