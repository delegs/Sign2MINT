import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from '../services/device.service';
import {LocalStorageService} from '../services/local-storage.service';
import {AppSettings} from '../app.settings';
import { SearchContext } from '../material/searchContext';
import { SearchMode } from '../values/searchMode';
import {LightIcons} from '../values/lightIcons';

@Component({
  selector: 'app-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.css']
})
export class SearchMenuComponent implements OnInit {

  faText = LightIcons.faText;
  isSmallMobile = false;

  constructor(
    private utilService: DeviceService,
    private router: Router,
    private localStorageService: LocalStorageService
    ) { }

  ngOnInit(): void {
    this.isSmallMobile = this.utilService.isSmallMobile();
  }

  onResize(): void {
    this.isSmallMobile = this.utilService.isSmallMobile();
  }

  navigateToSearch(searchContent: string): void {
    this.localStorageService.set(AppSettings.LocalStorageHideKeyboard, false);
    if ('text' === searchContent) {
      this.localStorageService.set(AppSettings.LocalStorageSearchContext, new SearchContext(SearchMode.Text));
    } else {
      this.localStorageService.set(AppSettings.LocalStorageSearchContext, new SearchContext(SearchMode.DGS));
    }
    this.router.navigate([`search/${searchContent}`]);
  }

}
