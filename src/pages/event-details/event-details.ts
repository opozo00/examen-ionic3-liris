import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { EventsapiProvider } from '../../providers/eventsapi/eventsapi';


@IonicPage()
@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {

  event: any = {};
  eventId: number;
  callback: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private favoriteProvider: FavoriteProvider, private eventsProvider: EventsapiProvider) { }

  ionViewWillLeave() {
    if (this.callback) {
      this.callback(this.event);
    }
  }

  ionViewWillEnter() {
    this.event = this.navParams.get('event');
    this.eventId = this.event.id;
    this.callback = this.navParams.get('callback');

    // Asegurar que isFavorite esté actualizado
    this.favoriteProvider.isFavorite(this.event).then(isFav => {
      this.event.isFavorite = isFav;
    });

    this.eventsProvider.getEvent(this.eventId).subscribe(
      data => {
        this.event = { ...data, isFavorite: this.event.isFavorite }; // conservar isFavorite
      },
      error => {
        console.error('Error al obtener datos del post', error);
      }
    );
  }

  toggleFavorite() {
    this.favoriteProvider.isFavorite(this.event).then(isFav => {
      if (isFav) {
        this.favoriteProvider.removeFavorite(this.event).then(() => {
          this.event.isFavorite = false;
        });
      } else {
        this.favoriteProvider.addFavorite(this.event).then(() => {
          this.event.isFavorite = true;
        });
      }
    }).catch(error => {
      console.error('Error toggling favorite', error);
    });
  }

}
