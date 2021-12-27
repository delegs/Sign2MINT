import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FaConfig} from '@fortawesome/angular-fontawesome';
import {SearchMode} from './values/searchMode';
import {LocalStorageService} from './services/local-storage.service';
import {AppSettings} from './app.settings';
import {DeviceService} from './services/device.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  previousUrl: string = null;
  currentUrl: string = null;

  title = 'sign2mint-website';
  isFooterComponentVisible: boolean;
  isHeaderComponentVisible: boolean;

  constructor(
    private faConfig: FaConfig,
    private route: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceService,
    private localStorageService: LocalStorageService) {

    faConfig.defaultPrefix = 'far';
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateFooterVisibility(event.url);
        this.updateHeaderVisibility(event.url);
        this.updateSearchMode(event.url);
      }
    });
  }

  updateFooterVisibility(url: string): void {
    const isVideoShareComponent = url.startsWith('/video-share/');
    const isGebaerdenSuche = url.endsWith('/gebaerdensuche');
    const isTextSuche = url.endsWith('/text');
    const isSearchFilter = url.endsWith('/filter');
    const isExcelImport = url.endsWith('/import');

    this.isFooterComponentVisible = !(isVideoShareComponent || isGebaerdenSuche || isTextSuche || isSearchFilter || isExcelImport);
  }

  updateHeaderVisibility(url: string): void {
    const isGebaerdenSuche = url.endsWith('/gebaerdensuche');
    const isTextSuche = url.endsWith('/text');
    const isMobile = this.deviceService.isMobile();
    const isGebOrText = isGebaerdenSuche || isTextSuche;
    this.isHeaderComponentVisible = !isMobile || !isGebOrText;
  }

  updateSearchMode(url: string): void {
    const isGebaerdenSuche = url.endsWith('/gebaerdensuche');
    const searchMode = isGebaerdenSuche ? SearchMode.DGS : SearchMode.Text;
    this.localStorageService.set(AppSettings.LocalStorageSearchMode, searchMode);
  }
}
