import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShowcase } from '../showcase.model';

@Component({
  selector: 'krftme-showcase-detail',
  templateUrl: './showcase-detail.component.html',
})
export class ShowcaseDetailComponent implements OnInit {
  showcase: IShowcase | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ showcase }) => {
      this.showcase = showcase;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
