import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IApplicationUserOffer } from '../application-user-offer.model';
import { ApplicationUserOfferService } from '../service/application-user-offer.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './application-user-offer-delete-dialog.component.html',
})
export class ApplicationUserOfferDeleteDialogComponent {
  applicationUserOffer?: IApplicationUserOffer;

  constructor(protected applicationUserOfferService: ApplicationUserOfferService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.applicationUserOfferService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
