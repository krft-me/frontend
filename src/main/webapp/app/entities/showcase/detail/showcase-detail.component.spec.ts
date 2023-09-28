import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShowcaseDetailComponent } from './showcase-detail.component';

describe('Showcase Management Detail Component', () => {
  let comp: ShowcaseDetailComponent;
  let fixture: ComponentFixture<ShowcaseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowcaseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ showcase: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShowcaseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShowcaseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load showcase on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.showcase).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
