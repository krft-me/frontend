import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ApplicationUserBadgeFormGroup, ApplicationUserBadgeFormService } from './application-user-badge-form.service';
import { IApplicationUserBadge } from '../application-user-badge.model';
import { ApplicationUserBadgeService } from '../service/application-user-badge.service';
import { IApplicationUser } from 'app/entities/krftme-microservice/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/krftme-microservice/application-user/service/application-user.service';
import { IBadge } from 'app/entities/krftme-microservice/badge/badge.model';
import { BadgeService } from 'app/entities/krftme-microservice/badge/service/badge.service';

@Component({
  selector: 'krftme-application-user-badge-update',
  templateUrl: './application-user-badge-update.component.html',
})
export class ApplicationUserBadgeUpdateComponent implements OnInit {
  isSaving = false;
  applicationUserBadge: IApplicationUserBadge | null = null;

  applicationUsersSharedCollection: IApplicationUser[] = [];
  badgesSharedCollection: IBadge[] = [];

  editForm: ApplicationUserBadgeFormGroup = this.applicationUserBadgeFormService.createApplicationUserBadgeFormGroup();

  constructor(
    protected applicationUserBadgeService: ApplicationUserBadgeService,
    protected applicationUserBadgeFormService: ApplicationUserBadgeFormService,
    protected applicationUserService: ApplicationUserService,
    protected badgeService: BadgeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  compareBadge = (o1: IBadge | null, o2: IBadge | null): boolean => this.badgeService.compareBadge(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUserBadge }) => {
      this.applicationUserBadge = applicationUserBadge;
      if (applicationUserBadge) {
        this.updateForm(applicationUserBadge);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const applicationUserBadge = this.applicationUserBadgeFormService.getApplicationUserBadge(this.editForm);
    if (applicationUserBadge.id !== null) {
      this.subscribeToSaveResponse(this.applicationUserBadgeService.update(applicationUserBadge));
    } else {
      this.subscribeToSaveResponse(this.applicationUserBadgeService.create(applicationUserBadge));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplicationUserBadge>>): void {
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

  protected updateForm(applicationUserBadge: IApplicationUserBadge): void {
    this.applicationUserBadge = applicationUserBadge;
    this.applicationUserBadgeFormService.resetForm(this.editForm, applicationUserBadge);

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      applicationUserBadge.user
    );
    this.badgesSharedCollection = this.badgeService.addBadgeToCollectionIfMissing<IBadge>(
      this.badgesSharedCollection,
      applicationUserBadge.badge
    );
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
            applicationUsers,
            this.applicationUserBadge?.user
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.badgeService
      .query()
      .pipe(map((res: HttpResponse<IBadge[]>) => res.body ?? []))
      .pipe(map((badges: IBadge[]) => this.badgeService.addBadgeToCollectionIfMissing<IBadge>(badges, this.applicationUserBadge?.badge)))
      .subscribe((badges: IBadge[]) => (this.badgesSharedCollection = badges));
  }
}
