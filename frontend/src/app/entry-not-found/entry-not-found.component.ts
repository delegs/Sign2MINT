import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import {AppSettings} from '../app.settings';
import {SearchContext} from '../material/searchContext';
import {SearchMode} from '../values/searchMode';
import {LocalStorageService} from '../services/local-storage.service';

@Component({
  selector: 'app-entry-not-found',
  templateUrl: './entry-not-found.component.html',
  styleUrls: ['./entry-not-found.component.scss']
})
export class EntryNotFoundComponent implements OnInit, OnDestroy {

  fachbegriff: string;
  id: string;
  subscriptionEvent: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.subscriptionEvent = this.route.params.subscribe(routeParams => {
      this.fachbegriff = routeParams.fachbegriff;
    });
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.subscriptionEvent.unsubscribe();
  }

  navigateToSearch(): void {
    this.localStorageService.set(AppSettings.LocalStorageSearchContext, new SearchContext(SearchMode.Text));
    this.router.navigate([`search/text`]);
  }

}
