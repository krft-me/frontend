import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MachineCategoryFormGroup, MachineCategoryFormService } from './machine-category-form.service';
import { IMachineCategory } from '../machine-category.model';
import { MachineCategoryService } from '../service/machine-category.service';

@Component({
  selector: 'krftme-machine-category-update',
  templateUrl: './machine-category-update.component.html',
})
export class MachineCategoryUpdateComponent implements OnInit {
  isSaving = false;
  machineCategory: IMachineCategory | null = null;

  editForm: MachineCategoryFormGroup = this.machineCategoryFormService.createMachineCategoryFormGroup();

  constructor(
    protected machineCategoryService: MachineCategoryService,
    protected machineCategoryFormService: MachineCategoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ machineCategory }) => {
      this.machineCategory = machineCategory;
      if (machineCategory) {
        this.updateForm(machineCategory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const machineCategory = this.machineCategoryFormService.getMachineCategory(this.editForm);
    if (machineCategory.id !== null) {
      this.subscribeToSaveResponse(this.machineCategoryService.update(machineCategory));
    } else {
      this.subscribeToSaveResponse(this.machineCategoryService.create(machineCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMachineCategory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(machineCategory: IMachineCategory): void {
    this.machineCategory = machineCategory;
    this.machineCategoryFormService.resetForm(this.editForm, machineCategory);
  }
}
