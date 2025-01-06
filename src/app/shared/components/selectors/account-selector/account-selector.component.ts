import { CommonModule } from '@angular/common';
import { Component, inject, input, OnDestroy, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, filter, finalize, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { SelectOnFocusDirective } from '../../../directives/select-on-focus.directive';
import { AccountSelectorResponse } from './models/responses/account-selecter.response';
import { AccountSelectorApiService } from './services/api/account-selector-api.service';

@Component({
  selector: 'am-account-selector',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    SelectOnFocusDirective,
  ],
  templateUrl: './account-selector.component.html',
  styleUrl: './account-selector.component.scss',
})
export class AccountSelectorComponent implements OnDestroy {
  private readonly accountSelectorApi = inject(AccountSelectorApiService);

  readonly debounceTime = input<number>(300);
  readonly pageSize = input<number>(10);

  readonly userSelected = output<AccountSelectorResponse>();

  protected readonly isLoading = signal(false);
  protected readonly filteredUsers = signal<AccountSelectorResponse[]>([]);

  readonly searchControl = new FormControl('');

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.setupAccountSearch();
  }

  displayFn = (account: AccountSelectorResponse): string => {
    if (!account.email || !account.firstName || !account.lastName) {
      return '';
    }

    return `${account.firstName} ${account.lastName} (${account?.email})`;
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleOptionSelected(user: AccountSelectorResponse): void {
    this.userSelected.emit(user);
  }

  private setupAccountSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime()),
        distinctUntilChanged(),
        filter((value): value is string => typeof value === 'string'),
        tap((term) => {
          if (!term?.trim()) {
            this.filteredUsers.set([]);

            return;
          }

          this.isLoading.set(true);
        }),
        filter((term) => term.trim().length > 0),
        switchMap((term) =>
          this.accountSelectorApi.filterAccounts(term, this.pageSize()).pipe(
            take(1),
            finalize(() => this.isLoading.set(false)),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (accounts) => this.filteredUsers.set(accounts),
        error: () => this.filteredUsers.set([]),
      });
  }
}
