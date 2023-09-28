import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ApplicationUserBadgeDetailComponent } from './application-user-badge-detail.component';

describe('ApplicationUserBadge Management Detail Component', () => {
  let comp: ApplicationUserBadgeDetailComponent;
  let fixture: ComponentFixture<ApplicationUserBadgeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationUserBadgeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ applicationUserBadge: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ApplicationUserBadgeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ApplicationUserBadgeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load applicationUserBadge on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.applicationUserBadge).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
