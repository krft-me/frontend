import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BadgeFormService, BadgeFormGroup } from './badge-form.service';
import { IBadge } from '../badge.model';
import { BadgeService } from '../service/badge.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-badge-update',
  templateUrl: './badge-update.component.html',
})
export class BadgeUpdateComponent implements OnInit {
  isSaving = false;
  badge: IBadge | null = null;

  editForm: BadgeFormGroup = this.badgeFormService.createBadgeFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected badgeService: BadgeService,
    protected badgeFormService: BadgeFormService,
    protected elementRef: ElementRef,
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

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('krftmeApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
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
