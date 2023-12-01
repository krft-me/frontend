import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShowcaseService } from '../service/showcase.service';

import { ShowcaseComponent } from './showcase.component';

describe('Showcase Management Component', () => {
  let comp: ShowcaseComponent;
  let fixture: ComponentFixture<ShowcaseComponent>;
  let service: ShowcaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'showcase', component: ShowcaseComponent }]), HttpClientTestingModule],
      declarations: [ShowcaseComponent],
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
      .overrideTemplate(ShowcaseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShowcaseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShowcaseService);

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
    expect(comp.showcases?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to showcaseService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getShowcaseIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getShowcaseIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
