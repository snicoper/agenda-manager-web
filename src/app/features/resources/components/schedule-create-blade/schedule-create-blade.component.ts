import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { ResourceApiService } from '../../services/api/resource-api.service';

@Component({
  selector: 'am-schedule-create-blade',
  imports: [],
  templateUrl: './schedule-create-blade.component.html',
  styleUrl: './schedule-create-blade.component.scss',
})
export class ScheduleCreateBladeComponent implements OnInit {
  private readonly apiService = inject(ResourceApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly bladeService = inject(BladeService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;

  ngOnInit(): void {
    this.buildForm();
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group({});
  }
}
