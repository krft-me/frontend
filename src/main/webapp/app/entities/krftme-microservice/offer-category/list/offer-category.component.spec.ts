import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OfferCategoryService } from '../service/offer-category.service';

import { OfferCategoryComponent } from './offer-category.component';

describe('OfferCategory Management Component', () => {
  let comp: OfferCategoryComponent;
  let fixture: ComponentFixture<OfferCategoryComponent>;
  let service: OfferCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'offer-category',
            component: OfferCategoryComponent,
          },
        ]),
        HttpClientTestingModule,
      ],
      declarations: [OfferCategoryComponent],
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
      .overrideTemplate(OfferCategoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferCategoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OfferCategoryService);

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
    expect(comp.offerCategories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to offerCategoryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOfferCategoryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOfferCategoryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
