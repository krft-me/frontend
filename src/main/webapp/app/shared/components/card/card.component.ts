import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TagComponent} from "../tag/tag.component";
import {NgForOf, NgStyle, UpperCasePipe} from "@angular/common";
import {OfferCardApi} from "../../../entities/dto/offer-card.api";

@Component({
  selector: 'jhi-card[offerCardApi]',
  standalone: true,
  imports: [TagComponent, NgForOf, NgStyle, UpperCasePipe],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() offerCardApi: OfferCardApi = new OfferCardApi();
  @Output() onLike: EventEmitter<number> = new EventEmitter();
  @Output() onNavigate: EventEmitter<number> = new EventEmitter();

  like() {
    this.onLike.emit(this.offerCardApi.offerId);
  }

  navigate() {
    this.onNavigate.emit(this.offerCardApi.offerId);
  }

}
