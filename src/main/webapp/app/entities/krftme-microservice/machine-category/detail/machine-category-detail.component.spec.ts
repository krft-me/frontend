import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MachineCategoryDetailComponent } from './machine-category-detail.component';

describe('MachineCategory Management Detail Component', () => {
  let comp: MachineCategoryDetailComponent;
  let fixture: ComponentFixture<MachineCategoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineCategoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ machineCategory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MachineCategoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MachineCategoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load machineCategory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.machineCategory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
