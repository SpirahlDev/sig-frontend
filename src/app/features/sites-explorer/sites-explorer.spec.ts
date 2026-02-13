import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesExplorer } from './sites-explorer';

describe('SitesExplorer', () => {
  let component: SitesExplorer;
  let fixture: ComponentFixture<SitesExplorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitesExplorer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitesExplorer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
