import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfferPackageComponent } from 'app/entities/offer-package/offer-package.component';
import { IOffer } from '../offer.model';

@Component({
  selector: 'jhi-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./../../../../content/css/offer-detail.css'],
})
export class OfferDetailComponent implements OnInit {
  @Input() offer: IOffer = {
    id: 0,
    title: '',
    machine: '',
    autor: '',
    description: '',
    picture_link: '',
    packages: [],
  };

  constructor(protected activatedRoute: ActivatedRoute) {
    this.offer.title = 'WoL';
    this.offer.picture_link = 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg';
    this.offer.autor = 'Hydaelin';
    this.offer.description = 'Entends... Ressens... Pense...';
    this.offer.machine = 'Crystal-mère';
    this.offer.packages = [
      {
        id: 0,
        title: 'package 1 truc truc',
        description: 'on chante sous la pluie',
        nbRatings: 6,
        price: 1.2,
        rating: 4.5,
      },
      {
        id: 1,
        title: 'package 2 truc',
        description: "on danse sous l'orage",
        nbRatings: 4,
        price: 1.4,
        rating: 2,
      },
      {
        id: 2,
        title: 'package 3',
        description: 'on ri sous le soleil',
        nbRatings: 2,
        price: 1.6,
        rating: 9,
      },
    ];
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offer }) => {
      this.offer = offer;
      console.log(this.offer);
    });
  }

  previousState(): void {
    window.history.back();
  }
}
