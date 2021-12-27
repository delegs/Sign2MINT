import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-entry-not-found',
  templateUrl: './entry-not-found.component.html',
  styleUrls: ['./entry-not-found.component.css']
})
export class EntryNotFoundComponent implements OnInit, OnDestroy {

  fachbegriff: string;
  id: string;
  subscriptionEvent: Subscription;

  constructor(
    private route: ActivatedRoute) {
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

}
