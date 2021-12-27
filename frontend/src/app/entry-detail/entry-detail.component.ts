import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {LexiconEntryService} from '../services/lexicon-entry.service';
import {LexiconEntry} from '../material/lexiconEntry';
import {Subscription} from 'rxjs';
import {environment} from '../../environments/environment';
import SwiperCore, {A11y, Navigation, Pagination, Scrollbar} from 'swiper/core';
import {ScrollService} from '../services/scroll.service';
import {DeviceService} from '../services/device.service';
import {DomSanitizer, Meta, SafeUrl} from '@angular/platform-browser';
import {AppSettings} from '../app.settings';
import {LocalStorageService} from '../services/local-storage.service';
import {ThumbnailService} from '../services/thumbnail.service';
import {SearchMode} from '../values/searchMode';
import {SearchContext} from '../material/searchContext';
import {Fachgebiete} from '../values/fachgebiete';
import {Fachgebiet} from '../values/fachgebiet';
import {BrandIcons} from '../values/brandIcons';
import {SolidIcons} from '../values/solidIcons';
import {delay} from 'rxjs/operators';
import {IconDefinition} from '@fortawesome/free-brands-svg-icons';
import {LightIcons} from '../values/lightIcons';
import {IconStyle} from '../values/iconStyles';
/*import {Observable} from 'rxjs';*/

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-entry-detail',
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.css']
})

export class EntryDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  componentName = AppSettings.EntryDetailComponentName;
  faChevronLeft = SolidIcons.faChevronLeft;
  faChevronRight = SolidIcons.faChevronRight;
  faArrowRight = LightIcons.faArrowRight;
  faArrowLeft = LightIcons.faArrowLeft;
  faDownload = SolidIcons.faDownload;
  faTwitter = BrandIcons.faTwitter;
  faWhatsapp = BrandIcons.faWhatsapp;
  faFacebook = BrandIcons.faFacebookSquare;
  videoplaying = true;
  lexiconEntryList: LexiconEntry[] = [];
  currentLexiconEntry: LexiconEntry = new LexiconEntry();
  variantLexiconEntryList: LexiconEntry[] = [];
  subscriptionEvent: Subscription;
  environment = environment;
  videoShareBaseUrl = 'https://test.sign2mint.de/video-share/';
  @ViewChild('desktopVideo') desktopVideo: ElementRef;
  @ViewChild('swiper') swiperElement: ElementRef;
  @ViewChildren('mediaVariant') videoVarianten: QueryList<ElementRef>;
  backendUrl;
  fachgebiete: Fachgebiet[];
  searchword: string;
  searchEntryCount: number;
  actualIndex: number;
  isPreviousButtonVisible = false;
  isNextButtonVisible = false;
  searchContext: SearchContext = new SearchContext(SearchMode.Text);
  isSearch = false;
  constructor(
    private metaService: Meta,
    private utilService: DeviceService,
    private lexiconEntryService: LexiconEntryService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private scrollService: ScrollService,
    private domSanitizer: DomSanitizer,
    private thumbnailService: ThumbnailService,
    private localStorageService: LocalStorageService) {
  }
  get isMobile(): boolean {
    return this.utilService.isMobile() || this.utilService.isTablet();
  }

  get getThumbnailLink(): string {

    if (this.currentLexiconEntry === undefined) {
      return 'assets/images/default_video_poster.png';
    }

    return this.thumbnailService.getThumbnailLink(this.currentLexiconEntry.id);
  }

  /**
   * Get entry by url on componenent initialization
   */
  ngOnInit(): void {

    this.localStorageService.set(AppSettings.LocalStorageHideKeyboard, false);

    this.subscriptionEvent = this.route.params.subscribe(() => {
      if (this.route.snapshot.routeConfig.path === 'entry/:fachbegriff') {
        this.getEntryByFachbegriff(this.route.snapshot, false);
      } else if (this.route.snapshot.routeConfig.path === 'entry/:fachbegriff/:id') {
        this.getEntryByFachbegriff(this.route.snapshot, true);
      }
    });
  }

  /**
   * returns the current search mode value from the local storage
   */
  get searchMode(): SearchMode {

    this.searchContext = Object.assign(this.searchContext, this.localStorageService.get(AppSettings.LocalStorageSearchContext));
    return this.searchContext.searchMode;
  }

  /**
   * scroll to the top of this page after view initialization
   */
  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }

  /**
   * prevent memory leaks by unsubscribe from event(s) when component destroyed
   */
  ngOnDestroy(): void {
    this.subscriptionEvent.unsubscribe();
  }

  /**
   *
   */
  initSearchResult(): void {
    this.searchContext = Object.assign(this.searchContext, this.localStorageService.get(AppSettings.LocalStorageSearchContext));
    if (this.searchContext) {
      // tslint:disable-next-line:max-line-length
      this.fachgebiete = this.searchContext.fachgebietsFilter.length > 0 ? this.searchContext.fachgebietsFilter : [Fachgebiete.alleGebaerden];
      this.searchword = this.searchContext.getSearchInput();
      this.isSearch = this.searchword.length > 0;
      const searchReslultList = this.searchContext.searchResultEntries;
      this.updateBrowseButtons(searchReslultList);
      this.searchEntryCount = searchReslultList.length;
      this.actualIndex = this.getCurrentLexiconEntryIndex(searchReslultList) + 1;
    } else {
      this.fachgebiete = [];
    }
  }

  isLastPageSearch(fachgebiet: string): boolean {
    return fachgebiet === 'Alle Gebärden';
  }

  /**
   *
   * @param route the current route
   * @param routeContainsId a boolean that returns whether the url contains the LexikonEntry Id
   */
  getEntryByFachbegriff = (route, routeContainsId) => {
    const fachbegriff = route.paramMap.get('fachbegriff');
    const lexikonEntryId = routeContainsId ? route.paramMap.get('id') : '';

    this.lexiconEntryService.getEntryByFachbegriff(fachbegriff).subscribe(response => {

      if (response == null) {
        const entryNotFoundRoute = `entry-not-found/${fachbegriff}`;
        this.router.navigate([entryNotFoundRoute]).then();
        return;
      }

      this.lexiconEntryList = response;
      this.lexiconEntryList = this.lexiconEntryList.sort((a, b) => {
        return (a.empfehlung > b.empfehlung) ? -1 : 1;
      });
      this.currentLexiconEntry = this.lexiconEntryList[0];

      if (routeContainsId && !this.lexiconEntryList.map(val => val.id).includes(lexikonEntryId)) {
        const entryNotFoundRoute = `entry-not-found/${fachbegriff}`;
        const routeParam = {id: lexikonEntryId};
        this.router.navigate([entryNotFoundRoute, routeParam]).then();
        return;
      }

      if (this.lexiconEntryList.length > 1) {
        if (routeContainsId) {
          this.currentLexiconEntry = this.lexiconEntryList.find(entry => entry.id === lexikonEntryId);
        }

        const recommendedEntry = this.lexiconEntryList.find(entry => entry.empfehlung === true);

        if (recommendedEntry && !routeContainsId) {
          this.currentLexiconEntry = recommendedEntry;
        }
      }

      if (!routeContainsId) {
        const routeToEntry = `entry/${this.currentLexiconEntry.fachbegriff}/${this.currentLexiconEntry.id}`;
        this.location.replaceState(routeToEntry);

        this.variantLexiconEntryList = routeContainsId
          ? this.lexiconEntryList.filter(entry => entry.id !== lexikonEntryId)
          : this.lexiconEntryList.filter(entry => entry !== this.currentLexiconEntry);
      }

      this.playDesktopVideo();
      this.initSearchResult();
      this.generateMetaData();

    });
  }


  playDesktopVideo(): void {
    if (this.desktopVideo != null) {
      this.desktopVideo.nativeElement.oncanplay = () => {
        this.desktopVideo.nativeElement.muted = true;
        this.desktopVideo.nativeElement.play();
        this.desktopVideo.nativeElement.oncanplay = null;
      };
    }
  }


  /**
   * navigates to the given url
   * @param navigateURL destination url
   * @param params url parameters
   */
  navigateToUrl(navigateURL: string, params?: {}): void {
    const scrollPosition = {windowPositionY: 0, containerPositionY: 0};
    this.scrollService.pushPreviousScrollPosition(scrollPosition);
    params ? this.router.navigate([navigateURL, params]) : this.router.navigate([navigateURL]);
  }

  /**
   * update the url and play the first variant of the selected fachbegriff after swipe
   * @param swiper the swiper html element
   */
  onSlideTransitionEnd(swiper): void {
    const activeIndex = swiper.activeIndex;
    const activeLexikonEntry = this.lexiconEntryList[activeIndex];
    const newState = `entry/${activeLexikonEntry.fachbegriff}/${activeLexikonEntry.id}`;
    this.location.replaceState(newState);

    const videoVariants = this.videoVarianten.toArray();
    const activeVariant = videoVariants[activeIndex].nativeElement;
    activeVariant.play();
  }

  /**
   * Set the current LexikonEntry as active entry and start video playback
   * @param swiper the swiper html element
   */
  async onObserverUpdate(swiper): Promise<void> {

    const varianten = this.videoVarianten.toArray();

    if (varianten.length === 0) {
      return;
    }

    const currentLexiconEntryIndex = this.lexiconEntryList.indexOf(this.currentLexiconEntry);
    varianten[currentLexiconEntryIndex].nativeElement.muted = true;
    varianten[currentLexiconEntryIndex].nativeElement.play();
    await delay(20);
    swiper.slideTo(currentLexiconEntryIndex, 1, false);
  }

  /**
   * Stop video playback and reset video time to 0
   * @param video the video html element
   */
  onVideoEnded(video): void {
    this.videoplaying = false;
    video.currentTime = 0;
  }

  /**
   * navigate to the previous entry
   */
  navigateToPreviousEntry(): void {
    this.searchContext = Object.assign(this.searchContext, this.localStorageService.get(AppSettings.LocalStorageSearchContext));
    const currentSearchResultList = this.searchContext.searchResultEntries;
    this.searchEntryCount = currentSearchResultList.length;
    const prevEntryIndex = this.getCurrentLexiconEntryIndex(currentSearchResultList) - 1;
    if (prevEntryIndex >= currentSearchResultList.length || prevEntryIndex < 0) {
      return;
    }

    const prevEntry = currentSearchResultList[prevEntryIndex];

    const previousFachbegriff = prevEntry.fachbegriff;
    const id = prevEntry.id;
    this.router.navigate([`entry/${previousFachbegriff}/${id}`]);
  }

  /**
   * navigate to the next entry
   */
  navigateToNextEntry(): void {
    this.searchContext = Object.assign(this.searchContext, this.localStorageService.get(AppSettings.LocalStorageSearchContext));
    const currentSearchResultList = this.searchContext.searchResultEntries;
    const nextEntryIndex = this.getCurrentLexiconEntryIndex(currentSearchResultList) + 1;
    if (nextEntryIndex >= currentSearchResultList.length || nextEntryIndex < 0) {
      return;
    }

    const nextEntry = currentSearchResultList[nextEntryIndex];

    const nextFachbegriff = nextEntry.fachbegriff;
    const id = nextEntry.id;
    this.router.navigate([`entry/${nextFachbegriff}/${id}`]);
  }

  /**
   * navigate to the first entry of the selected fachgebiet when its changed
   */
  navigateToFirstEntryOnFachgebietChanged(): void {
    this.searchContext = Object.assign(this.searchContext, this.localStorageService.get(AppSettings.LocalStorageSearchContext));
    if (this.searchContext.getSearchInput()) {
      this.localStorageService.set(AppSettings.LocalStorageHideKeyboard, true);
      const searchMode: SearchMode = this.searchContext.searchMode;
      const navigateURL = searchMode === SearchMode.DGS
        ? `search/gebaerdensuche/`
        : `search/text/`;

      this.router.navigate([navigateURL]);
    } else if (this.fachgebiete.length === 1) {
      this.router.navigate(['/entries', this.fachgebiete[0]]);
    } else {
      this.router.navigateByUrl('/entries');
    }
  }

  /**
   * navigate to the a variant
   * @param fachbegriff fachbegriff of the LexikonEntry
   * @param id id of the variant
   */
  navigateToVariant(fachbegriff: string, id: string): void {
    this.router.navigate(['/entry', fachbegriff, id]);
  }

  /**
   *
   */
  onVideoPlay(): void {
    this.videoplaying = true;
  }

  /**
   * stops the video playback and reset video time to 0
   * @param swiper the swiper html element
   */
  onSliderMove(swiper): void {
    const activeIndex = swiper.activeIndex;
    const varianten = this.videoVarianten.toArray();
    const currentVariante = varianten[activeIndex];
    const currentVideoElement = currentVariante.nativeElement;

    currentVideoElement.pause();
    currentVideoElement.currentTime = 0;
  }

  /**
   * generate the meta data of this page
   */
  generateMetaData(): void {
    const thumbnail = this.backendUrl + '/thumbnail/' +
      this.currentLexiconEntry.id + '/569/320';

    this.updateMetaData('twitter:card', 'player');
    this.updateMetaData('twitter:title', this.currentLexiconEntry.fachbegriff);
    this.updateMetaData('twitter:description', this.currentLexiconEntry.definition);
    this.updateMetaData('twitter:site', 'sign2mint');
    this.updateMetaData('twitter:player', this.videoShareBaseUrl + this.getFileNameFromVideoLink(this.currentLexiconEntry.videoLink));
    this.updateMetaData('twitter:player:stream', this.currentLexiconEntry.videoLink);
    this.updateMetaData('twitter:player:stream:content_type', 'video/mp4');
    this.updateMetaData('twitter:player:width', '200px');
    this.updateMetaData('twitter:player:height', '100px');
    this.updateMetaData('twitter:image', this.getThumbnailLink);

    this.updateMetaData('og:title', this.currentLexiconEntry.fachbegriff);
    this.updateMetaData('og:url', window.location.href);
    this.updateMetaData('og:image', thumbnail);
    this.updateMetaData('og:image:alt', this.currentLexiconEntry.fachbegriff);
    this.updateMetaData('og:description', this.currentLexiconEntry.definition);
    this.updateMetaData('og:type', 'video.other');
    this.updateMetaData('og:video', this.currentLexiconEntry.videoLink);
    this.updateMetaData('og:video:secure_url', this.currentLexiconEntry.videoLink);
    this.updateMetaData('og:video:type', 'video/mp4');
    this.updateMetaData('og:video:width', '200px');
    this.updateMetaData('og:video:height', '100px');
  }

  /**
   * update the meta data of this page
   */
  updateMetaData(name: string, content: string): void {

    const tag = this.metaService.getTag(`name='${name}'`);

    if (tag != null) {
      this.metaService.updateTag({name, content});
    } else {
      this.metaService.addTag({name, content});
    }
  }

  /**
   * returns the file name of a video link
   */
  getFileNameFromVideoLink(videoLink: string): string {
    const splittedLinkParts = videoLink.split('/');
    return splittedLinkParts[splittedLinkParts.length - 1];
  }

  /**
   * returns the desktop social media link of the specified platform
   */
  getSocialLinkDesktop(social: string): string {

    const windowLocation = window.location.href;
    const fachgebiete = this.currentLexiconEntry.fachgebiete.join(',');

    if (social === 'twitter') {
      return `https://twitter.com/intent/tweet?url=${windowLocation}&via=Sign2Mint&text=Schau dir diese Fachgebärde auf sign2mint.de an&hashtags=fachgebaerden,${fachgebiete}`;
    }
    if (social === 'facebook') {
      return `https://www.facebook.com/sharer/sharer.php?u=${windowLocation}`;
    }
    if (social === 'whatsapp') {
      return `https://web.whatsapp.com/send?text=${windowLocation}`;
    }
  }

  /**
   * returns the mobile social media link of the specified platform
   */
  getSocialLinkMobile(social: string): string | SafeUrl {

    const windowLocation = window.location.href;

    if (social === 'twitter') {
      return this.getSocialLinkDesktop(social);
    }
    if (social === 'facebook') {
      return this.getSocialLinkDesktop(social);
    }
    if (social === 'whatsapp') {
      if (window.navigator.platform === 'iPhone') {
        return `https://api.whatsapp.com/send?text=${windowLocation}`;
      }
      return this.domSanitizer.bypassSecurityTrustUrl(`whatsapp://send?text=${windowLocation}`);
    }
  }

  /**
   * updates the visibility of "next entry" and "last entry" button
   */
  updateBrowseButtons(currentSearchResultList: any): void {
    const currentLexiconEntryIndex = this.getCurrentLexiconEntryIndex(currentSearchResultList);
    this.isPreviousButtonVisible = currentLexiconEntryIndex !== 0;
    this.isNextButtonVisible = currentLexiconEntryIndex !== currentSearchResultList.length - 1;
  }

  /**
   * resolve the index of the current entry in the search results
   */
  getCurrentLexiconEntryIndex(currentSearchResultList): number {
    let currentEntryIndex = 0;
    currentSearchResultList.find((entry: LexiconEntry, index) => {
      if (entry.id === this.currentLexiconEntry.id) {
        currentEntryIndex = index;
      }
    });
    return currentEntryIndex;
  }

  getIconForFachgebiet(fachgebiet: string): IconDefinition {
    return Fachgebiete.getIconByTitle(fachgebiet, IconStyle.regular);
  }
}
