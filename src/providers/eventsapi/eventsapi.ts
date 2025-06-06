import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
  Generated class for the EventsapiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventsapiProvider {

  //Api Events
  private events = 'http://localhost/appdelportal/wp-json/delportal/v1/eventsop';

  constructor(public http: HttpClient) {
    //console.log('Hello EventsapiProvider Provider');
  }

  getEvents(): Observable<any> {
    return this.http.get(this.events);
  }
  getEvent(id: number): Observable<any> {
    return this.http.get(`${this.events}/${id}`);
  }

}
