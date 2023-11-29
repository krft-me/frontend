import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMachineCategory } from '../machine-category.model';

@Component({
  selector: 'krftme-machine-category-detail',
  templateUrl: './machine-category-detail.component.html',
})
export class MachineCategoryDetailComponent implements OnInit {
  machineCategory: IMachineCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ machineCategory }) => {
      this.machineCategory = machineCategory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
