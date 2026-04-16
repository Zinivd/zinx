import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorjectListComponent } from './list.component';

describe('PorjectListComponent', () => {
  let component: PorjectListComponent;
  let fixture: ComponentFixture<PorjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorjectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
