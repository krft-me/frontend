import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IApplicationUserBadge } from '../application-user-badge.model';

@Component({
  selector: 'jhi-application-user-badge-detail',
  templateUrl: './application-user-badge-detail.component.html',
})
export class ApplicationUserBadgeDetailComponent implements OnInit {
  applicationUserBadge: IApplicationUserBadge | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUserBadge }) => {
      this.applicationUserBadge = applicationUserBadge;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
