import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MachineFormGroup, MachineFormService } from './machine-form.service';
import { IMachine } from '../machine.model';
import { MachineService } from '../service/machine.service';
import { IMachineCategory } from 'app/entities/krftme-microservice/machine-category/machine-category.model';
import { MachineCategoryService } from 'app/entities/krftme-microservice/machine-category/service/machine-category.service';

@Component({
  selector: 'krftme-machine-update',
  templateUrl: './machine-update.component.html',
})
export class MachineUpdateComponent implements OnInit {
  isSaving = false;
  machine: IMachine | null = null;

  machineCategoriesSharedCollection: IMachineCategory[] = [];

  editForm: MachineFormGroup = this.machineFormService.createMachineFormGroup();

  constructor(
    protected machineService: MachineService,
    protected machineFormService: MachineFormService,
    protected machineCategoryService: MachineCategoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMachineCategory = (o1: IMachineCategory | null, o2: IMachineCategory | null): boolean =>
    this.machineCategoryService.compareMachineCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ machine }) => {
      this.machine = machine;
      if (machine) {
        this.updateForm(machine);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const machine = this.machineFormService.getMachine(this.editForm);
    if (machine.id !== null) {
      this.subscribeToSaveResponse(this.machineService.update(machine));
    } else {
      this.subscribeToSaveResponse(this.machineService.create(machine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMachine>>): void {
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

  protected updateForm(machine: IMachine): void {
    this.machine = machine;
    this.machineFormService.resetForm(this.editForm, machine);

    this.machineCategoriesSharedCollection = this.machineCategoryService.addMachineCategoryToCollectionIfMissing<IMachineCategory>(
      this.machineCategoriesSharedCollection,
      machine.category
    );
  }

  protected loadRelationshipsOptions(): void {
    this.machineCategoryService
      .query()
      .pipe(map((res: HttpResponse<IMachineCategory[]>) => res.body ?? []))
      .pipe(
        map((machineCategories: IMachineCategory[]) =>
          this.machineCategoryService.addMachineCategoryToCollectionIfMissing<IMachineCategory>(machineCategories, this.machine?.category)
        )
      )
      .subscribe((machineCategories: IMachineCategory[]) => (this.machineCategoriesSharedCollection = machineCategories));
  }
}
