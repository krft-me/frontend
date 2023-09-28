import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IApplicationUserOffer } from '../application-user-offer.model';

@Component({
  selector: 'jhi-application-user-offer-detail',
  templateUrl: './application-user-offer-detail.component.html',
})
export class ApplicationUserOfferDetailComponent implements OnInit {
  applicationUserOffer: IApplicationUserOffer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUserOffer }) => {
      this.applicationUserOffer = applicationUserOffer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
