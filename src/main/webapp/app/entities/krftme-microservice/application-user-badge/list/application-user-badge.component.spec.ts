import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ApplicationUserBadgeService } from '../service/application-user-badge.service';

import { ApplicationUserBadgeComponent } from './application-user-badge.component';

describe('ApplicationUserBadge Management Component', () => {
  let comp: ApplicationUserBadgeComponent;
  let fixture: ComponentFixture<ApplicationUserBadgeComponent>;
  let service: ApplicationUserBadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'application-user-badge', component: ApplicationUserBadgeComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ApplicationUserBadgeComponent],
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
      .overrideTemplate(ApplicationUserBadgeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationUserBadgeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ApplicationUserBadgeService);

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
    expect(comp.applicationUserBadges?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to applicationUserBadgeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getApplicationUserBadgeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getApplicationUserBadgeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
