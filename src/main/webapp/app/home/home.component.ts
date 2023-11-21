import { Component, OnInit } from '@angular/core';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import {OfferCardApi} from "../entities/dto/offer-card.api";

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  account: Account | null = null;
  offerCardApiList: OfferCardApi[] = [
    {
      machine: 'Imprimante 3D',
      offerId: 1,
      offer: 'J\'imprime vos pièces 3D',
      offerPicture: 'https://plus.unsplash.com/premium_photo-1680037568241-5499309fb6c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2624&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tags: ['PETG', '0.5mm', 'Bambulabx1'],
      rate: 4.5,
      numberRates: 12,
      minimalPrice: 5.00,
      profilePicture: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2364&q=80',
      profileName: 'EniXo',
      city: 'Caen',
      isLiked: true
    },
    {
      machine: 'Imprimante 3D',
      offerId: 2,
      offer: 'J\'imprime vos pièces 3D',
      offerPicture: 'https://plus.unsplash.com/premium_photo-1680037568241-5499309fb6c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2624&q=80',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tags: ['PETG', '0.5mm', 'Bambulabx1'],
      rate: 4.5,
      numberRates: 12,
      minimalPrice: 5.00,
      profilePicture: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2364&q=80',
      profileName: 'EniXo',
      city: 'Caen',
      isLiked: true
    }
  ];

  constructor(private accountService: AccountService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.account = account));
  }

  login(): void {
    this.loginService.login();
  }
}
