import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { EventsapiProvider } from '../../providers/eventsapi/eventsapi';
import { Geolocation } from '@ionic-native/geolocation';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@IonicPage()
@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {

  event: any = {};
  eventId: number;
  callback: any;
  latitude: number;
  longitude: number;
  mapUrl: SafeResourceUrl;
  videoUrl: SafeResourceUrl;

  constructor(public navCtrl: NavController, public navParams: NavParams, private favoriteProvider: FavoriteProvider, private eventsProvider: EventsapiProvider, private geolocation: Geolocation, private sanitizer: DomSanitizer) { }

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

    // Parse to int
    this.event.location_lat = this.event.location_lat ? parseFloat(this.event.location_lat.trim()) : 0;
    this.event.location_lng = this.event.location_lng ? parseFloat(this.event.location_lng.trim()) : 0;

    const url = `https://maps.google.com/maps?q=${this.event.location_lat},${this.event.location_lng}&z=15&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.event.video_url);
    // console.log('Ubicacion >>>', this.mapUrl);
    // console.log('URL >>>', this.videoUrl);


    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('Latitude:', resp.coords.latitude);
      console.log('Longitude:', resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   console.log('Updated Latitude:', data.coords.latitude);
    //   console.log('Updated Longitude:', data.coords.longitude);
    // });
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
