import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MachineService } from '../service/machine.service';

import { MachineComponent } from './machine.component';

describe('Machine Management Component', () => {
  let comp: MachineComponent;
  let fixture: ComponentFixture<MachineComponent>;
  let service: MachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'machine', component: MachineComponent }]), HttpClientTestingModule],
      declarations: [MachineComponent],
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
      .overrideTemplate(MachineComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MachineComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MachineService);

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
    expect(comp.machines?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to machineService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMachineIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMachineIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
