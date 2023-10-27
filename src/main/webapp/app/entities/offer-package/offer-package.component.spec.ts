import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPackageComponent } from './offer-package.component';

describe('OfferPackageComponent', () => {
  let component: OfferPackageComponent;
  let fixture: ComponentFixture<OfferPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferPackageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
