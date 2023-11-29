import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOfferCategory } from '../offer-category.model';

@Component({
  selector: 'krftme-offer-category-detail',
  templateUrl: './offer-category-detail.component.html',
})
export class OfferCategoryDetailComponent implements OnInit {
  offerCategory: IOfferCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offerCategory }) => {
      this.offerCategory = offerCategory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
