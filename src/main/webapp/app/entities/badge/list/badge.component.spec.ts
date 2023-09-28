import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BadgeService } from '../service/badge.service';

import { BadgeComponent } from './badge.component';

describe('Badge Management Component', () => {
  let comp: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;
  let service: BadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'badge', component: BadgeComponent }]), HttpClientTestingModule],
      declarations: [BadgeComponent],
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
      .overrideTemplate(BadgeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BadgeService);

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
    expect(comp.badges?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to badgeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBadgeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBadgeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
