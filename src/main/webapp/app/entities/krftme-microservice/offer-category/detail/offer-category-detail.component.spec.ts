import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfferCategoryDetailComponent } from './offer-category-detail.component';

describe('OfferCategory Management Detail Component', () => {
  let comp: OfferCategoryDetailComponent;
  let fixture: ComponentFixture<OfferCategoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfferCategoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ offerCategory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OfferCategoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OfferCategoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load offerCategory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.offerCategory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
