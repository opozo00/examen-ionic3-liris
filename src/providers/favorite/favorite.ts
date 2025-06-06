import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';



const STORAGE_KEY = 'events_favorites';

@Injectable()
export class FavoriteProvider {

  constructor(public http: HttpClient, private storage: Storage) { }

  //Se usan funciones a partir de objetos clave valor
  getAllFavorites() {
    return this.storage.get(STORAGE_KEY);
  }

  addFavorite(item: any) {
    return this.storage.get(STORAGE_KEY).then((favorites: { [key: number]: any }) => {
      if (!favorites) {
        favorites = {};
      }
      console.log('FAAVVVVORITES', favorites);
      console.log('itemmmmmmmmm', item);
      favorites[item.id] = item;
      return this.storage.set(STORAGE_KEY, favorites);
    });
  }

  removeFavorite(item: any) {
    return this.storage.get(STORAGE_KEY).then((favorites: { [key: number]: any }) => {
      if (favorites && favorites[item.id]) {
        delete favorites[item.id];
        return this.storage.set(STORAGE_KEY, favorites);
      }
      return null;
    });
  }

  isFavorite(item: any) {
    return this.storage.get(STORAGE_KEY).then((favorites: { [key: number]: any }) => {
      return !!(favorites && favorites[item.id]);
    });
  }

}
