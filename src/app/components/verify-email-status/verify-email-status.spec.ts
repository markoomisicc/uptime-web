import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyEmailStatus } from './verify-email-status';

describe('VerifyEmailStatus', () => {
  let component: VerifyEmailStatus;
  let fixture: ComponentFixture<VerifyEmailStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmailStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyEmailStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
