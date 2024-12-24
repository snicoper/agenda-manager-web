import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { AccountCreateRequest } from '../../interfaces/requests/account-create.request';
import { AccountApiService } from '../../services/api/account-api.service';
import { AccountCreateBladeComponent } from './account-create-blade.component';

describe('AccountCreateBladeComponent', () => {
  let component: AccountCreateBladeComponent;
  let fixture: ComponentFixture<AccountCreateBladeComponent>;
  let mockApiService: jasmine.SpyObj<AccountApiService>;
  let mockSnackBarService: jasmine.SpyObj<SnackBarService>;
  let mockBladeService: jasmine.SpyObj<BladeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj('AccountApiService', ['createAccount']);
    mockSnackBarService = jasmine.createSpyObj('SnackBarService', ['success']);
    mockBladeService = jasmine.createSpyObj('BladeService', ['emitResult']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [AccountCreateBladeComponent],
      providers: [
        provideHttpClient(),
        provideAnimations(),
        { provide: AccountApiService, useValue: mockApiService },
        { provide: SnackBarService, useValue: mockSnackBarService },
        { provide: BladeService, useValue: mockBladeService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = TestBed.createComponent(AccountCreateBladeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a formState object', () => {
    expect(component.formState).toBeTruthy();
  });

  it('should have a formInputTypes object', () => {
    expect(component.formInputTypes).toBeTruthy();
  });

  it('should have a loadingRoles property', () => {
    expect(component.loadingRoles).toBeDefined();
  });

  it('should have a ngOnInit method', () => {
    expect(component.ngOnInit).toBeTruthy();
  });

  describe('Form validation', () => {
    it('should mark form as ibvalid when form is empty', () => {
      component.ngOnInit();
      expect(component.formState.form.valid).toBeFalsy();
    });

    it('should validate email format', () => {
      component.ngOnInit();
      const emailControl = component.formState.form.get('email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalsy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should require at least one role', () => {
      component.ngOnInit();
      const rolesControl = component.formState.form.get('roles');

      rolesControl?.setValue([]);
      expect(rolesControl?.valid).toBeFalsy();

      rolesControl?.setValue(['admin']);
      expect(rolesControl?.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    const mockAccountCreateRequest: AccountCreateRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isCollaborator: false,
      roles: [{ roleId: '123' }],
    };

    it('should not submit form when invalid', () => {
      component.ngOnInit();
      component.handleSubmit();
      expect(mockApiService.createAccount).not.toHaveBeenCalled();
    });

    it('should submit form when valid', () => {
      component.ngOnInit();
      const form = component.formState.form;

      form.setValue(mockAccountCreateRequest);
      mockApiService.createAccount.and.returnValue(of({ userId: '123' }));

      component.handleSubmit();

      expect(mockApiService.createAccount).toHaveBeenCalledWith(mockAccountCreateRequest);
      expect(component.formState.isLoading).toBeFalse();
    });

    it('should handle create account error', () => {
      component.ngOnInit();
      const form = component.formState.form;

      form.setValue(mockAccountCreateRequest);

      const mockError = new HttpErrorResponse({
        error: { message: 'Error creating account' },
        status: 400,
        statusText: 'Bad Request',
      });
      mockApiService.createAccount.and.returnValue(throwError(() => mockError));

      component.handleSubmit();

      expect(mockSnackBarService.success).not.toHaveBeenCalled();
      expect(component.formState.badRequest).toBeTruthy();
      expect(component.formState.isLoading).toBeFalsy();
    });
  });

  describe('Blade Interactions', () => {
    it('should close blade when handleCloseBlade is called', () => {
      component.handleCloseBlade();
      expect(mockBladeService.emitResult).toHaveBeenCalledWith(false);
    });

    it('should emit true and navigate when account is created successfully', () => {
      component.ngOnInit();
      const form = component.formState.form;

      form.setValue({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isCollaborator: false,
        roles: ['admin'],
      });

      mockApiService.createAccount.and.returnValue(of({ userId: '123' }));

      component.handleSubmit();

      expect(mockBladeService.emitResult).toHaveBeenCalledWith(true);
      expect(mockRouter.navigate).toHaveBeenCalled();
      expect(mockSnackBarService.success).toHaveBeenCalledWith('Usuario creado correctamente');
    });
  });
});
