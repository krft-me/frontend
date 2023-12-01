import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BadgeFormGroup, BadgeFormService } from './badge-form.service';
import { IBadge } from '../badge.model';
import { BadgeService } from '../service/badge.service';

@Component({
  selector: 'krftme-badge-update',
  templateUrl: './badge-update.component.html',
})
export class BadgeUpdateComponent implements OnInit {
  isSaving = false;
  badge: IBadge | null = null;

  editForm: BadgeFormGroup = this.badgeFormService.createBadgeFormGroup();

  constructor(
    protected badgeService: BadgeService,
    protected badgeFormService: BadgeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ badge }) => {
      this.badge = badge;
      if (badge) {
        this.updateForm(badge);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const badge = this.badgeFormService.getBadge(this.editForm);
    if (badge.id !== null) {
      this.subscribeToSaveResponse(this.badgeService.update(badge));
    } else {
      this.subscribeToSaveResponse(this.badgeService.create(badge));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBadge>>): void {
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

  protected updateForm(badge: IBadge): void {
    this.badge = badge;
    this.badgeFormService.resetForm(this.editForm, badge);
  }
}
