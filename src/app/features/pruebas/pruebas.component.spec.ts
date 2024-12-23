import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PruebasComponent } from './pruebas.component';

describe('PruebasComponent', () => {
  let component: PruebasComponent;
  let fixture: ComponentFixture<PruebasComponent>;
  let loggerSpy: { logInfo: jasmine.Spy };

  beforeEach(async () => {
    loggerSpy = jasmine.createSpyObj('logger', ['logInfo']);
    (window as any).logInfo = loggerSpy.logInfo;

    await TestBed.configureTestingModule({
      imports: [PruebasComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(PruebasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
