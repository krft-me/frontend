import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrder } from '../order.model';

@Component({
  selector: 'krftme-order-detail',
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  order: IOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
