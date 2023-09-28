import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MachineFormService, MachineFormGroup } from './machine-form.service';
import { IMachine } from '../machine.model';
import { MachineService } from '../service/machine.service';
import { IOffer } from 'app/entities/offer/offer.model';
import { OfferService } from 'app/entities/offer/service/offer.service';

@Component({
  selector: 'jhi-machine-update',
  templateUrl: './machine-update.component.html',
})
export class MachineUpdateComponent implements OnInit {
  isSaving = false;
  machine: IMachine | null = null;

  offersSharedCollection: IOffer[] = [];

  editForm: MachineFormGroup = this.machineFormService.createMachineFormGroup();

  constructor(
    protected machineService: MachineService,
    protected machineFormService: MachineFormService,
    protected offerService: OfferService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOffer = (o1: IOffer | null, o2: IOffer | null): boolean => this.offerService.compareOffer(o1, o2);

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

    this.offersSharedCollection = this.offerService.addOfferToCollectionIfMissing<IOffer>(this.offersSharedCollection, machine.offer);
  }

  protected loadRelationshipsOptions(): void {
    this.offerService
      .query()
      .pipe(map((res: HttpResponse<IOffer[]>) => res.body ?? []))
      .pipe(map((offers: IOffer[]) => this.offerService.addOfferToCollectionIfMissing<IOffer>(offers, this.machine?.offer)))
      .subscribe((offers: IOffer[]) => (this.offersSharedCollection = offers));
  }
}
