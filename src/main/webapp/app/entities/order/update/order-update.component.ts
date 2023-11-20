import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OrderFormService, OrderFormGroup } from './order-form.service';
import { IOrder } from '../order.model';
import { OrderService } from '../service/order.service';
import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';
import { ApplicationUserOfferService } from 'app/entities/application-user-offer/service/application-user-offer.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { State } from 'app/entities/enumerations/state.model';

@Component({
  selector: 'krftme-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;
  order: IOrder | null = null;
  stateValues = Object.keys(State);

  applicationUserOffersSharedCollection: IApplicationUserOffer[] = [];
  applicationUsersSharedCollection: IApplicationUser[] = [];

  editForm: OrderFormGroup = this.orderFormService.createOrderFormGroup();

  constructor(
    protected orderService: OrderService,
    protected orderFormService: OrderFormService,
    protected applicationUserOfferService: ApplicationUserOfferService,
    protected applicationUserService: ApplicationUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUserOffer = (o1: IApplicationUserOffer | null, o2: IApplicationUserOffer | null): boolean =>
    this.applicationUserOfferService.compareApplicationUserOffer(o1, o2);

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
      if (order) {
        this.updateForm(order);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.orderFormService.getOrder(this.editForm);
    if (order.id !== null) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
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

  protected updateForm(order: IOrder): void {
    this.order = order;
    this.orderFormService.resetForm(this.editForm, order);

    this.applicationUserOffersSharedCollection =
      this.applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing<IApplicationUserOffer>(
        this.applicationUserOffersSharedCollection,
        order.provider
      );
    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      order.client
    );
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserOfferService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUserOffer[]>) => res.body ?? []))
      .pipe(
        map((applicationUserOffers: IApplicationUserOffer[]) =>
          this.applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing<IApplicationUserOffer>(
            applicationUserOffers,
            this.order?.provider
          )
        )
      )
      .subscribe((applicationUserOffers: IApplicationUserOffer[]) => (this.applicationUserOffersSharedCollection = applicationUserOffers));

    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(applicationUsers, this.order?.client)
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));
  }
}
