import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckEmailPanel } from './check-email-panel';

describe('CheckEmailPanel', () => {
  let component: CheckEmailPanel;
  let fixture: ComponentFixture<CheckEmailPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckEmailPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckEmailPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
