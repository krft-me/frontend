import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CategoryFormService, CategoryFormGroup } from './category-form.service';
import { ICategory } from '../category.model';
import { CategoryService } from '../service/category.service';
import { IMachine } from 'app/entities/machine/machine.model';
import { MachineService } from 'app/entities/machine/service/machine.service';

@Component({
  selector: 'jhi-category-update',
  templateUrl: './category-update.component.html',
})
export class CategoryUpdateComponent implements OnInit {
  isSaving = false;
  category: ICategory | null = null;

  machinesSharedCollection: IMachine[] = [];

  editForm: CategoryFormGroup = this.categoryFormService.createCategoryFormGroup();

  constructor(
    protected categoryService: CategoryService,
    protected categoryFormService: CategoryFormService,
    protected machineService: MachineService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMachine = (o1: IMachine | null, o2: IMachine | null): boolean => this.machineService.compareMachine(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ category }) => {
      this.category = category;
      if (category) {
        this.updateForm(category);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const category = this.categoryFormService.getCategory(this.editForm);
    if (category.id !== null) {
      this.subscribeToSaveResponse(this.categoryService.update(category));
    } else {
      this.subscribeToSaveResponse(this.categoryService.create(category));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategory>>): void {
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

  protected updateForm(category: ICategory): void {
    this.category = category;
    this.categoryFormService.resetForm(this.editForm, category);

    this.machinesSharedCollection = this.machineService.addMachineToCollectionIfMissing<IMachine>(
      this.machinesSharedCollection,
      category.machine
    );
  }

  protected loadRelationshipsOptions(): void {
    this.machineService
      .query()
      .pipe(map((res: HttpResponse<IMachine[]>) => res.body ?? []))
      .pipe(map((machines: IMachine[]) => this.machineService.addMachineToCollectionIfMissing<IMachine>(machines, this.category?.machine)))
      .subscribe((machines: IMachine[]) => (this.machinesSharedCollection = machines));
  }
}
