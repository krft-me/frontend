import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MachineCategoryService } from '../service/machine-category.service';

import { MachineCategoryComponent } from './machine-category.component';

describe('MachineCategory Management Component', () => {
  let comp: MachineCategoryComponent;
  let fixture: ComponentFixture<MachineCategoryComponent>;
  let service: MachineCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'machine-category', component: MachineCategoryComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [MachineCategoryComponent],
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
      .overrideTemplate(MachineCategoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MachineCategoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MachineCategoryService);

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
    expect(comp.machineCategories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to machineCategoryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMachineCategoryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMachineCategoryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
