import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import {ScrollService} from '../services/scroll.service';
import {Fachgebiete} from '../values/fachgebiete';
import {SolidIcons} from '../values/solidIcons';
import {DuotoneIcons} from '../values/duotoneIcons';
import {LightIcons} from '../values/lightIcons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  self = 'header-';
  arrow = SolidIcons.faChevronDown;
  showFilter = false;
  showFilterObserver: Subscription;
  iconAll = LightIcons.faSignLanguage;
  fachgebiete = Fachgebiete.getAll();

  constructor(private router: Router,
              private scrollService: ScrollService) { }

  ngOnInit(): void {
    this.showFilterObserver = fromEvent(window, 'resize').subscribe(
      () => {
        if (this.isDesktopView()){
          this.showFilter = true;
        }
        else{
          this.showFilter = this.arrow === SolidIcons.faChevronUp;
        }
      });
    this.showFilter = this.isDesktopView();
  }

  ngOnDestroy(): void {
    this.showFilterObserver.unsubscribe();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.arrow = this.showFilter ? SolidIcons.faChevronUp : SolidIcons.faChevronDown;
  }


  handleOpenAllEntriesByFilter(fachgebiet: string): void {
    this.scrollService.pushPreviousScrollPosition({windowPositionY: 0 , containerPositionY: 0});
    if (fachgebiet.length === 0){
      this.router.navigateByUrl('/entries');
    } else {
      this.router.navigate(['/entries', {fachgebiet}]);
    }
  }

  isDesktopView(): boolean {
    return window.innerWidth >= 1024;
  }
}
