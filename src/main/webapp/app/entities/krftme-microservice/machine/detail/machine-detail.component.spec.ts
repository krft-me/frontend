import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MachineDetailComponent } from './machine-detail.component';

describe('Machine Management Detail Component', () => {
  let comp: MachineDetailComponent;
  let fixture: ComponentFixture<MachineDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ machine: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MachineDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MachineDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load machine on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.machine).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
