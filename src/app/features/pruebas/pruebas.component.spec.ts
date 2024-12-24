import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PruebasComponent } from './pruebas.component';

describe('PruebasComponent', () => {
  let component: PruebasComponent;
  let fixture: ComponentFixture<PruebasComponent>;
  let loggerSpy: { logInfo: jasmine.Spy };

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('logger', ['logInfo']);
    (window as any).logInfo = loggerSpy.logInfo;

    TestBed.configureTestingModule({
      imports: [PruebasComponent],
      providers: [],
    });

    fixture = TestBed.createComponent(PruebasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
