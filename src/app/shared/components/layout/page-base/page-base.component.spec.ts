import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NavigationEnd, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { PageBaseComponent } from './page-base.component';

describe('PageBaseComponent', () => {
  let component: PageBaseComponent;
  let fixture: ComponentFixture<PageBaseComponent>;
  let routerMock: { events: Subject<any> };

  beforeEach(async () => {
    routerMock = {
      events: new Subject(),
    };

    await TestBed.configureTestingModule({
      imports: [PageBaseComponent],
      providers: [provideRouter([]), provideHttpClient(), provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(PageBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLeaving to false on NavigationEnd', () => {
    const navigationEndEvent = new NavigationEnd(1, '/initial', '/target');

    routerMock.events.next(navigationEndEvent);

    expect(component.isLeaving).toBeFalse();
  });
});
