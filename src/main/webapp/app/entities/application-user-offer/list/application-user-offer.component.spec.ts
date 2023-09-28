import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ApplicationUserOfferService } from '../service/application-user-offer.service';

import { ApplicationUserOfferComponent } from './application-user-offer.component';

describe('ApplicationUserOffer Management Component', () => {
  let comp: ApplicationUserOfferComponent;
  let fixture: ComponentFixture<ApplicationUserOfferComponent>;
  let service: ApplicationUserOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'application-user-offer', component: ApplicationUserOfferComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ApplicationUserOfferComponent],
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
      .overrideTemplate(ApplicationUserOfferComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationUserOfferComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ApplicationUserOfferService);

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
    expect(comp.applicationUserOffers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to applicationUserOfferService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getApplicationUserOfferIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getApplicationUserOfferIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
