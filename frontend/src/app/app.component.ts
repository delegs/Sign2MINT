import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FaConfig} from '@fortawesome/angular-fontawesome';
import {SearchMode} from './values/searchMode';
import {LocalStorageService} from './services/local-storage.service';
import {AppSettings} from './app.settings';
import {DeviceService} from './services/device.service';
import {canConfigureHeaderVisibility} from './header-configurator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  previousUrl: string = null;
  currentUrl: string = null;

  title = 'sign2mint-website';
  isFooterComponentVisible: boolean;
  isHeaderComponentVisible: boolean;
  currentOutletComponent: Component;

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
        this.updateHeaderVisibility();
        this.updateSearchMode(event.url);
      }
    });
  }

  onOutletLoaded(component): void {
    this.currentOutletComponent = component;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateHeaderVisibility();
  }

  updateFooterVisibility(url: string): void {
    const isVideoShareComponent = url.startsWith('/video-share/');
    const isGebaerdenSuche = url.endsWith('/gebaerdensuche');
    const isTextSuche = url.endsWith('/text');
    const isSearchFilter = url.endsWith('/filter');
    const isExcelImport = url.endsWith('/import');

    this.isFooterComponentVisible = !(isVideoShareComponent || isGebaerdenSuche || isTextSuche || isSearchFilter || isExcelImport);
  }

  updateHeaderVisibility(): void {
    if (canConfigureHeaderVisibility(this.currentOutletComponent)) {
      if (this.deviceService.isMobile() && this.currentOutletComponent.showHeaderMobile
        || this.deviceService.isTablet() && this.currentOutletComponent.showHeaderTablet
        || this.deviceService.isDesktop() && this.currentOutletComponent.showHeaderDesktop) {
        this.isHeaderComponentVisible = true;
      } else {
        this.isHeaderComponentVisible = false;
      }
    } else {
      this.isHeaderComponentVisible = true;
    }
  }

  updateSearchMode(url: string): void {
    const isGebaerdenSuche = url.endsWith('/gebaerdensuche');
    const searchMode = isGebaerdenSuche ? SearchMode.DGS : SearchMode.Text;
    this.localStorageService.set(AppSettings.LocalStorageSearchMode, searchMode);
  }
}
