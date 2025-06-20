import { Component, Sanitizer } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { EventsapiProvider } from '../../providers/eventsapi/eventsapi';
import { EventDetailsPage } from '../event-details/event-details';
import * as moment from 'moment';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  events: any[] = [];
  isFavorite = false;
  filteredEvents: any[] = [];
  startDate: string;
  endDate: string;
  selectedDays: number = null;
  //momentjs: any = moment;
  isClicked = false;
  // Local IP of your PC hosting WordPress (adjust to yours)
  private localDevIP = '192.168.131.193';
  private flipbookRelativePath = '/appdelportal/dp_eventos/evento-de-flipbook/';
  public flipbookUrl: SafeResourceUrl;


  constructor(public navCtrl: NavController, public navParams: NavParams, private favoriteProvider: FavoriteProvider, private eventsApi: EventsapiProvider, private socialSharing: SocialSharing, private iab: InAppBrowser, private sanitizer: DomSanitizer) {
    // Build full URL dynamically
    const rawUrl = `http://${this.localDevIP}${this.flipbookRelativePath}`;
    this.flipbookUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  compileMessage(index): string {
    let msg = this.filteredEvents[index].title + '-' + this.filteredEvents[index].location_name;
    return msg.concat('\n Enviado desde app de eventos!')
  }

  regularShare(index) {
    var msg = this.compileMessage(index);
    this.socialSharing.share(msg, null, null, null);
  }
  facebookShare(index) {
    var msg = this.compileMessage(index);
    this.socialSharing.shareViaFacebook(msg, null, null);
  }

  //Método que llama el flipbook
  openFlipbook() {
    this.navCtrl.push('FlipbookViewerPage', {
      //url: 'https://yourdomain.com/flipbook-viewer/'
      url: 'http://localhost/appdelportal/dp_eventos/evento-de-flipbook/'
    });
  }


  loadEvents() {
    this.eventsApi.getEvents().subscribe(
      data => {
        console.log('Datos cargados', data);
        //this.events = data;

        // Sorting events by event_date
        this.events = data.sort((a: any, b: any) => {
          //return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
          return moment(a.event_date).valueOf() - moment(b.event_date).valueOf();
        });

        this.events.forEach(event => {
          event.event_date = moment(event.event_date).format('YYYY-MM-DD'); // Formato similar al del calendario
        });

        // Set filteredEvents to show all events initially
        this.filteredEvents = [...this.events];

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

  filterByDateRange() {
    if (!this.startDate || !this.endDate) {
      this.filteredEvents = [...this.events]; // Show all events if no dates are selected
      return;
    }

    this.filteredEvents = this.events.filter(event => {
      let eventDate = moment(event.event_date, 'YYYY-MM-DD'); // Normalize to YYYY-MM-DD
      let start = moment(this.startDate, 'YYYY-MM-DD');
      let end = moment(this.endDate, 'YYYY-MM-DD');
      // return eventDate >= start && eventDate <= end;
      return eventDate.isBetween(start, end, undefined, '[]');
    });

    console.log('Eventos filtrados:', this.filteredEvents);
  }

  filterByPredefinedDate(date: number) {
    this.selectedDays = date;
    this.isClicked = !this.isClicked;
    const today = moment(); // Fecha actual
    const PredefinedDaysAgo = moment().subtract(date, 'days'); //Días anteriores
    //const PredefinedDaysAgo = moment().add(date, 'days');   //Días próximos
    this.filteredEvents = this.events.filter(event => {
      const eventDay = moment(event.event_date, 'YYYY-MM-DD');
      return eventDay.isSameOrAfter(PredefinedDaysAgo) && eventDay.isSameOrBefore(today);   //Días anteriores
      //return eventDay.isSameOrBefore(PredefinedDaysAgo) && eventDay.isSameOrAfter(today); //Días próximos
    });
    console.log(`Eventos de los últimos ${date} días:`, this.filteredEvents);
  }



  ionViewWillLoad() {
    this.loadEvents();
  }

}
