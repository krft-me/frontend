import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IApplicationUserBadge } from '../application-user-badge.model';
import { ApplicationUserBadgeService } from '../service/application-user-badge.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './application-user-badge-delete-dialog.component.html',
})
export class ApplicationUserBadgeDeleteDialogComponent {
  applicationUserBadge?: IApplicationUserBadge;

  constructor(protected applicationUserBadgeService: ApplicationUserBadgeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.applicationUserBadgeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
