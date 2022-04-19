import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  public search(searchTerm: string){
    gtag('event', 'search', {
      search_term: searchTerm
    });
  }
}
