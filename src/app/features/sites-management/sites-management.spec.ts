import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesManagement } from './sites-management';

describe('SitesManagement', () => {
  let component: SitesManagement;
  let fixture: ComponentFixture<SitesManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitesManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitesManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
