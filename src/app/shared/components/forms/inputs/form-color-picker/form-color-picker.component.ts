/* eslint-disable  @typescript-eslint/no-empty-function */
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  forwardRef,
  input,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import ColorPicker, { ColorPickerOptions } from '@thednp/color-picker';
import { fromEvent, Subject, takeUntil } from 'rxjs';
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

  private readonly destroy$ = new Subject<void>();

  readonly value = signal('');
  readonly isDisabled = signal(false);

  private colorPicker!: ColorPicker;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  readonly id = `color-picker-field-${(FormColorPickerComponent.nextId += 1)}`;

  constructor() {
    // Efecto para manejar cambios en el valor.
    effect(() => {
      const currentValue = this.value();

      if (this.colorPicker) {
        this.updateColorPicker(currentValue);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeColorPicker();
    this.setupColorPickerListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.colorPicker?.dispose();
  }

  private initializeColorPicker(): void {
    this.colorPicker = new ColorPicker(this.elementRef.nativeElement, this.options());
    this.updateColorPicker(this.value());
  }

  private setupColorPickerListeners(): void {
    // Escuchar cambios en el color picker usando rxjs.
    fromEvent(this.elementRef.nativeElement, 'colorpicker.change')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const newValue = this.colorPicker.value;

        if (newValue !== this.value()) {
          this.value.set(newValue);
          this.onChange(newValue);
          this.onTouch();
        }
      });
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
    this.value.set(value);
    this.onChange(value);
    this.onTouch();
  }

  private updateColorPicker(value: string): void {
    if (!this.colorPicker || value === this.colorPicker.value) {
      return;
    }

    this.colorPicker.color = new ColorPicker.Color(value);
    this.colorPicker.update();
  }
}
