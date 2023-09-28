import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ApplicationUserOfferDetailComponent } from './application-user-offer-detail.component';

describe('ApplicationUserOffer Management Detail Component', () => {
  let comp: ApplicationUserOfferDetailComponent;
  let fixture: ComponentFixture<ApplicationUserOfferDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationUserOfferDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ applicationUserOffer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ApplicationUserOfferDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ApplicationUserOfferDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load applicationUserOffer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.applicationUserOffer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
