import { Component, Input, OnInit } from '@angular/core';
import { IOfferPackage } from './offerpackage.model';

@Component({
  selector: 'jhi-offer-package',
  templateUrl: './offer-package.component.html',
  styleUrls: ['./../../../content/css/offer-package.css'],
})
export class OfferPackageComponent implements OnInit {
  @Input() package!: IOfferPackage;

  constructor() {}

  ngOnInit(): void {}
}
