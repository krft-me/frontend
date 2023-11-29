import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfferDetailComponent } from './offer-detail.component';

describe('Offer Management Detail Component', () => {
  let comp: OfferDetailComponent;
  let fixture: ComponentFixture<OfferDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfferDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ offer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OfferDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OfferDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load offer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.offer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
