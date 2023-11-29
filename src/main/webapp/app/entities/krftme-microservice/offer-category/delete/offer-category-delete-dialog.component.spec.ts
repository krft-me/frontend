jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OfferCategoryService } from '../service/offer-category.service';

import { OfferCategoryDeleteDialogComponent } from './offer-category-delete-dialog.component';

describe('OfferCategory Management Delete Component', () => {
  let comp: OfferCategoryDeleteDialogComponent;
  let fixture: ComponentFixture<OfferCategoryDeleteDialogComponent>;
  let service: OfferCategoryService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OfferCategoryDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(OfferCategoryDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OfferCategoryDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OfferCategoryService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
