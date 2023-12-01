import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShowcase } from '../showcase.model';
import { ShowcaseService } from '../service/showcase.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './showcase-delete-dialog.component.html',
})
export class ShowcaseDeleteDialogComponent {
  showcase?: IShowcase;

  constructor(protected showcaseService: ShowcaseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.showcaseService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
