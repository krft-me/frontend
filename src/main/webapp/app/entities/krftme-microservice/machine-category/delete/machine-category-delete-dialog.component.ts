import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMachineCategory } from '../machine-category.model';
import { MachineCategoryService } from '../service/machine-category.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './machine-category-delete-dialog.component.html',
})
export class MachineCategoryDeleteDialogComponent {
  machineCategory?: IMachineCategory;

  constructor(protected machineCategoryService: MachineCategoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.machineCategoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
