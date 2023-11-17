import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ApplicationUserFormService, ApplicationUserFormGroup } from './application-user-form.service';
import { IApplicationUser } from '../application-user.model';
import { ApplicationUserService } from '../service/application-user.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICity } from 'app/entities/city/city.model';
import { CityService } from 'app/entities/city/service/city.service';
import { IOffer } from 'app/entities/offer/offer.model';
import { OfferService } from 'app/entities/offer/service/offer.service';

@Component({
  selector: 'krftme-application-user-update',
  templateUrl: './application-user-update.component.html',
})
export class ApplicationUserUpdateComponent implements OnInit {
  isSaving = false;
  applicationUser: IApplicationUser | null = null;

  usersSharedCollection: IUser[] = [];
  citiesSharedCollection: ICity[] = [];
  applicationUsersSharedCollection: IApplicationUser[] = [];
  offersSharedCollection: IOffer[] = [];

  editForm: ApplicationUserFormGroup = this.applicationUserFormService.createApplicationUserFormGroup();

  constructor(
    protected applicationUserService: ApplicationUserService,
    protected applicationUserFormService: ApplicationUserFormService,
    protected userService: UserService,
    protected cityService: CityService,
    protected offerService: OfferService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCity = (o1: ICity | null, o2: ICity | null): boolean => this.cityService.compareCity(o1, o2);

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  compareOffer = (o1: IOffer | null, o2: IOffer | null): boolean => this.offerService.compareOffer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUser }) => {
      this.applicationUser = applicationUser;
      if (applicationUser) {
        this.updateForm(applicationUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const applicationUser = this.applicationUserFormService.getApplicationUser(this.editForm);
    if (applicationUser.id !== null) {
      this.subscribeToSaveResponse(this.applicationUserService.update(applicationUser));
    } else {
      this.subscribeToSaveResponse(this.applicationUserService.create(applicationUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplicationUser>>): void {
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

  protected updateForm(applicationUser: IApplicationUser): void {
    this.applicationUser = applicationUser;
    this.applicationUserFormService.resetForm(this.editForm, applicationUser);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      applicationUser.internalUser
    );
    this.citiesSharedCollection = this.cityService.addCityToCollectionIfMissing<ICity>(this.citiesSharedCollection, applicationUser.city);
    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      ...(applicationUser.favoriteApplicationUsers ?? [])
    );
    this.offersSharedCollection = this.offerService.addOfferToCollectionIfMissing<IOffer>(
      this.offersSharedCollection,
      ...(applicationUser.favoriteOffers ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.applicationUser?.internalUser)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.cityService
      .query()
      .pipe(map((res: HttpResponse<ICity[]>) => res.body ?? []))
      .pipe(map((cities: ICity[]) => this.cityService.addCityToCollectionIfMissing<ICity>(cities, this.applicationUser?.city)))
      .subscribe((cities: ICity[]) => (this.citiesSharedCollection = cities));

    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
            applicationUsers,
            ...(this.applicationUser?.favoriteApplicationUsers ?? [])
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.offerService
      .query()
      .pipe(map((res: HttpResponse<IOffer[]>) => res.body ?? []))
      .pipe(
        map((offers: IOffer[]) =>
          this.offerService.addOfferToCollectionIfMissing<IOffer>(offers, ...(this.applicationUser?.favoriteOffers ?? []))
        )
      )
      .subscribe((offers: IOffer[]) => (this.offersSharedCollection = offers));
  }
}
