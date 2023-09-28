import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMachine } from '../machine.model';

@Component({
  selector: 'jhi-machine-detail',
  templateUrl: './machine-detail.component.html',
})
export class MachineDetailComponent implements OnInit {
  machine: IMachine | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ machine }) => {
      this.machine = machine;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
