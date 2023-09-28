import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBadge } from '../badge.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-badge-detail',
  templateUrl: './badge-detail.component.html',
})
export class BadgeDetailComponent implements OnInit {
  badge: IBadge | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ badge }) => {
      this.badge = badge;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
