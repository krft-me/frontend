import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOfferCategory } from '../offer-category.model';
import { OfferCategoryService } from '../service/offer-category.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './offer-category-delete-dialog.component.html',
})
export class OfferCategoryDeleteDialogComponent {
  offerCategory?: IOfferCategory;

  constructor(protected offerCategoryService: OfferCategoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.offerCategoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
