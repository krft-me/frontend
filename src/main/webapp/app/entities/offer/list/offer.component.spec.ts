import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OfferService } from '../service/offer.service';

import { OfferComponent } from './offer.component';

describe('Offer Management Component', () => {
  let comp: OfferComponent;
  let fixture: ComponentFixture<OfferComponent>;
  let service: OfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'offer', component: OfferComponent }]), HttpClientTestingModule],
      declarations: [OfferComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(OfferComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OfferService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.offers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to offerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOfferIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOfferIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
