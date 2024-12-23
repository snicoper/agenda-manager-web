import { provideHttpClient } from '@angular/common/http';
import { computed } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { PaginatedResult } from '../../../../shared/paginated-result/paginated-result';
import { CalendarPaginatedResponse } from '../../interfaces/responses/calendar-paginated.response';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarListComponent } from './calendar-list.component';

describe('CalendarListComponent', () => {
  let component: CalendarListComponent;
  let fixture: ComponentFixture<CalendarListComponent>;
  let mockCalendarApiService: jasmine.SpyObj<CalendarApiService>;
  let mockSnackBarService: jasmine.SpyObj<SnackBarService>;
  let mockBladeService: jasmine.SpyObj<BladeService>;

  const mockCalendars: CalendarPaginatedResponse[] = [
    { calendarId: '1', name: 'Calendar 1', description: 'Description 1', isActive: true },
    { calendarId: '2', name: 'Calendar 2', description: 'Description 2', isActive: false },
  ];

  const mockPaginatedResponse = new PaginatedResult<CalendarPaginatedResponse>();
  mockPaginatedResponse.items = mockCalendars;
  mockPaginatedResponse.pageNumber = 1;
  mockPaginatedResponse.pageSize = 25;
  mockPaginatedResponse.totalItems = mockCalendars.length;
  mockPaginatedResponse.totalPages = 1;

  beforeEach(async () => {
    mockCalendarApiService = jasmine.createSpyObj('CalendarApiService', ['getCalendarsPaginated']);
    mockSnackBarService = jasmine.createSpyObj('SnackBarService', ['error', 'success']);
    mockBladeService = jasmine.createSpyObj('BladeService', ['show', 'result'], {
      bladeState: {
        isVisible: computed(() => false),
        component: computed(() => null),
        options: computed(() => ({})),
      },
      result: of(true),
    });
    mockCalendarApiService.getCalendarsPaginated.and.returnValue(of(mockPaginatedResponse));

    await TestBed.configureTestingModule({
      imports: [CalendarListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideAnimations(),
        { provide: CalendarApiService, useValue: mockCalendarApiService },
        { provide: SnackBarService, useValue: mockSnackBarService },
        { provide: BladeService, useValue: mockBladeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarListComponent);
    component = fixture.componentInstance;

    // Simula ngAfterViewInit.
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load calendars on init', fakeAsync(() => {
    // Reinicia el spy antes del test.
    mockCalendarApiService.getCalendarsPaginated.calls.reset();

    // Simula completamente la inicialización del componente.
    component.ngAfterViewInit();

    // Fuerza la detección de cambios.
    fixture.detectChanges();
    tick();

    // Verifica que se llamó al método de obtener calendarios.
    expect(mockCalendarApiService.getCalendarsPaginated).toHaveBeenCalled();

    // Verifica que los datos se han cargado correctamente.
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0]).toEqual(mockCalendars[0]);
    expect(component.dataSource.data[1]).toEqual(mockCalendars[1]);

    // Verifica que la carga ha terminado
    expect(component.loading).toBeFalse();
  }));

  it('should handle page event', () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 20 };
    component.handlePageEvent(pageEvent);

    expect(mockCalendarApiService.getCalendarsPaginated).toHaveBeenCalled();
  });

  it('should handle sort change', () => {
    const sortEvent: Sort = { active: 'name', direction: 'asc' };
    component.handleSortChange(sortEvent);

    expect(mockCalendarApiService.getCalendarsPaginated).toHaveBeenCalled();
  });

  it('should handle error when loading calendars', fakeAsync(() => {
    mockCalendarApiService.getCalendarsPaginated.and.returnValue(
      throwError(() => new Error('Error al cargar calendarios')),
    );

    component.ngAfterViewInit();
    tick();

    expect(mockSnackBarService.error).toHaveBeenCalledWith('Ha ocurrido un error al cargar los calendarios.');
    expect(component.loading).toBeFalse();
  }));

  it('should handle create calendar', () => {
    component.handleCreateCalendar();

    expect(mockBladeService.show).toHaveBeenCalled();
    expect(mockCalendarApiService.getCalendarsPaginated).toHaveBeenCalled();
  });
});
