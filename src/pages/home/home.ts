import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { EventsapiProvider } from '../../providers/eventsapi/eventsapi';
import { EventDetailsPage } from '../event-details/event-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  events: any[] = [];
  isFavorite = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private favoriteProvider: FavoriteProvider, private eventsApi: EventsapiProvider) { }

  loadEvents() {
    this.eventsApi.getEvents().subscribe(
      data => {
        console.log('Datos cargados', data);
        //this.events = data;

        // Sorting events by event_date
        this.events = data.sort((a: any, b: any) => {
          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        });


        this.favoriteProvider.getAllFavorites().then(favorites => {
          if (favorites) {
            this.events.forEach(event => {
              event.isFavorite = !!favorites[event.id];
            });
          }
        });
      },
      error => {
        console.error('Error al obtener los eventos', error);
      }
    )
  }

  viewEvent(event: any) {
    if (!event) {
      console.error("Invalid event object: ", event)
      return;
    }
    this.navCtrl.push(EventDetailsPage, {
      event: event,
      callback: this.updatePostCallback
    });
  }

  updatePostCallback = (updatedEvent) => {
    return new Promise<void>((resolve, reject) => {
      const index = this.events.findIndex(p => p.id === updatedEvent.id);
      if (index !== -1) {
        // Asegurar que la propiedad `isFavorite` existe
        this.favoriteProvider.isFavorite(updatedEvent).then(isFav => {
          updatedEvent.isFavorite = isFav;
          this.events[index] = updatedEvent;
          resolve();
        }).catch(err => {
          console.error("Error al verificar favorito en callback", err);
          this.events[index] = updatedEvent; // Continuar con update aunque falle favorito
          resolve();
        });
      } else {
        resolve(); // No encontrado, simplemente resolver
      }
    });
  };

  //   filterEvents() {
  //   if (this.startDate && this.endDate) {
  //     const start = new Date(this.startDate).getTime();
  //     const end = new Date(this.endDate).getTime();

  //     this.filteredEvents = this.events.filter(event => {
  //       const eventDate = new Date(event.event_date).getTime();
  //       return eventDate >= start && eventDate <= end;
  //     });
  //   } else {
  //     console.warn("Selecciona un rango de fechas válido.");
  //   }
  // }


  ionViewWillLoad() {
    this.loadEvents();
  }

}
