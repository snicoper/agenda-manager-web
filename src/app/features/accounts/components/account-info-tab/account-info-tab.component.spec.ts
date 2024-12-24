import { provideHttpClient } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DateTime } from 'luxon';
import { of, throwError } from 'rxjs';
import { IdentityDocumentType } from '../../../../core/modules/identity-document/identity-document-type.enum';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { AccountDetailsState } from '../../interfaces/account-details-state.interface';
import { AccountDetailsResponse } from '../../interfaces/responses/account-details.response';
import { AccountDetailsService } from '../../services/account-details.service';
import { AccountApiService } from '../../services/api/account-api.service';
import { AccountInfoTabComponent } from './account-info-tab.component';

describe('AccountInfoTabComponent', () => {
  let component: AccountInfoTabComponent;
  let fixture: ComponentFixture<AccountInfoTabComponent>;
  let mockAccountApiService: jasmine.SpyObj<AccountApiService>;
  let mockSnackBarService: jasmine.SpyObj<SnackBarService>;
  let mockBladeService: jasmine.SpyObj<BladeService>;
  let mockAccountDetailsService: {
    state: AccountDetailsState;
    load: jasmine.Spy;
    setLoadingState: jasmine.Spy;
  };

  const mockAccount: AccountDetailsResponse = {
    userId: '1123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isEmailConfirmed: true,
    isActive: true,
    isCollaborator: false,
    createdAt: DateTime.local(),
    phoneNumber: {
      countryCode: '+34',
      number: '123456789',
    },
    address: {
      street: 'Calle Test',
      city: 'Test City',
      postalCode: '12345',
      country: 'Test Country',
    },
    identityDocument: {
      number: '123456789',
      countryCode: 'ES',
      type: IdentityDocumentType.NationalId,
    },
  };

  beforeEach(() => {
    const userId$ = signal<string | null>('1123');
    const account$ = signal<AccountDetailsResponse | null>(mockAccount);
    const loading$ = signal<boolean>(false);

    mockAccountApiService = jasmine.createSpyObj('AccountApiService', [
      'toggleIsActive',
      'confirmEmail',
      'toggleIsCollaborator',
    ]);

    mockSnackBarService = jasmine.createSpyObj('SnackBarService', ['success', 'error']);

    mockAccountDetailsService = {
      state: {
        userId: computed(() => userId$()),
        account: computed(() => account$()),
        loading: computed(() => loading$()),
      },
      load: jasmine.createSpy('load'),
      setLoadingState: jasmine.createSpy('setLoadingState'),
    };

    mockBladeService = jasmine.createSpyObj('BladeService', ['show'], {
      result: of(true),
    });

    TestBed.configureTestingModule({
      imports: [AccountInfoTabComponent],
      providers: [
        provideHttpClient(),
        provideAnimations(),
        { provide: AccountApiService, useValue: mockAccountApiService },
        { provide: SnackBarService, useValue: mockSnackBarService },
        { provide: AccountDetailsService, useValue: mockAccountDetailsService },
        { provide: BladeService, useValue: mockBladeService },
      ],
    });

    fixture = TestBed.createComponent(AccountInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set breadcrumb on init', () => {
    expect(component.breadcrumb).toBeTruthy();
  });

  // Test para handleChangeStateIsActive
  it('should toggle account active state', () => {
    mockAccountApiService.toggleIsActive.and.returnValue(of(true));

    component.handleChangeStateIsActive();

    expect(mockAccountApiService.toggleIsActive).toHaveBeenCalledWith(mockAccount.userId);
    expect(mockAccountDetailsService.setLoadingState).toHaveBeenCalledTimes(2);
    expect(mockSnackBarService.success).toHaveBeenCalled();
  });

  it('should handle error when toggling active state', () => {
    mockAccountApiService.toggleIsActive.and.returnValue(throwError(() => new Error('Toggle error')));

    component.handleChangeStateIsActive();

    expect(mockAccountApiService.toggleIsActive).toHaveBeenCalledWith(mockAccount.userId);
    expect(mockAccountDetailsService.setLoadingState).toHaveBeenCalledTimes(2);
    expect(mockSnackBarService.error).toHaveBeenCalledWith('Error al actualizar el estado de la cuenta');
  });
});
