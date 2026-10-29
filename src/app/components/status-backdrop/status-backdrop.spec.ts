import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBackdrop } from './status-backdrop';

describe('StatusBackdrop', () => {
  let component: StatusBackdrop;
  let fixture: ComponentFixture<StatusBackdrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBackdrop],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBackdrop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
