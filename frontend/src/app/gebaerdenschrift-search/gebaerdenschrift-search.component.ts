import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LexiconEntryService} from '../services/lexicon-entry.service';
import {SymbolIdService} from '../services/symbol-id.service';
import {AppSettings} from '../app.settings';
import {LocalStorageService} from '../services/local-storage.service';
import {SearchMode} from '../values/searchMode';
import {Subscription} from 'rxjs';
import {SignKeyboardUnicodes} from '../values/signKeyboardUnicodes';
import {DeviceService} from '../services/device.service';
import {Fachgebiete} from '../values/fachgebiete';
import {SearchContext} from '../material/searchContext';
import {Urspuenge} from '../values/urspruenge';
import {Verwendungskontexte} from '../values/verwendungskontexte';
import {Ursprung} from '../values/ursprung';
import {Gebaerde} from '../values/gebaerde';
import {SolidIcons} from '../values/solidIcons';
import {LightIcons} from '../values/lightIcons';
import {SearchService} from '../services/search.service';
import {RegularIcons} from '../values/regularIcons';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-gebaerdenschrift-search',
  templateUrl: './gebaerdenschrift-search.component.html',
  styleUrls: ['./gebaerdenschrift-search.component.css']
})
export class GebaerdenschriftSearchComponent implements OnInit, OnDestroy {

  hideKeyboard = false;

  @ViewChild('gebaerdensucheInput') gebaerdensucheInput: ElementRef;

  faChevronUp = LightIcons.faChevronUp;
  faChevronDown = LightIcons.faChevronDown;
  faChevronLeft = LightIcons.faChevronLeft;
  faTimes = LightIcons.faTimes;
  faCheck = SolidIcons.checked;
  faSquare = LightIcons.faSquare;
  faCheckCircle = LightIcons.faCheckCircle;
  faFilter = LightIcons.faFilter;
  faArrowRight = RegularIcons.faLongArrowRight;

  lexikonentryCount = 0;
  searchResultCount = 0;
  visibleEndIndex = 0;
  isFocus = true;
  searching = false;
  readonly visibleIndexIncrement = 20;

  handFormMenuName = 'Handformen';
  zweihandGebaerdenMenuName = '2-Hand';
  kontaktMenuName = 'Kontakt';
  bewegungMenuName = 'Bewegung';
  fachgebietMenuName = 'Fachgebiet';
  ursprungMenuName = 'Ursprung';
  verwendungskontextMenuName = 'Verwendungskontext';

  isHandformMenuSelected = true;
  isZweihandGebaerdenMenuSelected = false;
  isKontaktMenuSelected = false;
  isBewegungMenuSelected = false;
  isFachgebietMenuSelected = false;
  isUrsprungMenuSelected = false;
  isVerwendungskontextMenuSelected = false;

  useISWAFont = true;

  handformen = SignKeyboardUnicodes.handformen;
  zweihandGebaerden = SignKeyboardUnicodes.zweihandGebaerden;
  kontakte = SignKeyboardUnicodes.kontakte;
  bewegungen = SignKeyboardUnicodes.bewegungen;
  fachgebiete = Fachgebiete.getAll();
  urspruenge = Urspuenge.getAll();
  verwendungskontexte = Verwendungskontexte.getAll();

  searchContext = new SearchContext(SearchMode.DGS);

  private subscription: Subscription;

  constructor(
    private lexiconEntryService: LexiconEntryService,
    private symbolIdService: SymbolIdService,
    private localStorageService: LocalStorageService,
    private utilService: DeviceService,
    private searchService: SearchService
  ) {
  }

  get isDesktop(): boolean {
    return this.utilService.isDesktop();
  }

  get searchResultText(): string {

    if (this.searchContext.gebaerdenInput.length === 0) {
      return 'Es liegt noch keine Eingabe vor';
    } else if (this.searching) {
      return 'Suche läuft...';
    } else {
      return this.searchResultCount > 0 ?
        `Suchergebnisse: ${this.searchResultCount} / ${this.lexikonentryCount}` :
        `Keine Ergebnisse gefunden`;
    }
  }

  get getSearchInputAsUnicodeArray(): string[] {
    return Array.from(this.searchContext.gebaerdenInput);
  }

  ngOnInit(): void {
    this.searchContext = SearchContext.parse(this.localStorageService.get(AppSettings.LocalStorageSearchContext));
    const searchMode: SearchMode = this.searchContext.searchMode;
    if (searchMode !== SearchMode.DGS) {
      this.clearSearch();
    }

    this.localStorageService.set(AppSettings.LocalStorageSearchMode, SearchMode.DGS);
    this.subscription = this.lexiconEntryService.getEntryCount().subscribe(count => {
      this.lexikonentryCount = count;
      if (!this.utilService.isDesktop()) {
        this.gebaerdensucheInput.nativeElement.focus();
      }
    });
    this.loadStateFromStorage();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadStateFromStorage(): void {
    this.searchContext = SearchContext.parse(this.localStorageService.get(AppSettings.LocalStorageSearchContext));

    if (this.searchContext.fachgebietsFilter.length > 0 ||
      this.searchContext.ursprungFilter.length > 0 ||
      this.searchContext.verwendungskontextFilter.length > 0) {
      this.faFilter = SolidIcons.faFilter;
    }

    if (this.searchContext) {
      if (this.searchContext.gebaerdenInput.length > 0) {
        setTimeout(() => this.search(), 200);
      }
    }
  }

  saveStateToStorage(): void {
    this.localStorageService.set(AppSettings.LocalStorageSearchContext, this.searchContext);
  }

  backToPreviousSite(): void {
    window.history.back();
  }

  onFocus(): void {
    const hideKeyboard = this.localStorageService.get(AppSettings.LocalStorageHideKeyboard) ?? false;
    if (!hideKeyboard) {
      this.gebaerdensucheInput.nativeElement.focus();
      }
    this.isFocus = !hideKeyboard;
  }

  setFocus(isFocus: boolean): void {
    this.isFocus = isFocus;
    if (isFocus) {
      this.gebaerdensucheInput.nativeElement.focus();
    }
  }

  isFocusChange(event): void {
    this.isFocus = event;
  }

  clearSearch(): void {
    this.searchContext = new SearchContext(SearchMode.DGS);
    this.localStorageService.set(AppSettings.LocalStorageSearchContext, this.searchContext);
    this.searchContext.gebaerdenInput = '';
    this.searchResultCount = 0;
  }

  onGebaerdenTastaturClick(unicode: string): void {
    if (this.searchContext.gebaerdenInput.includes(unicode)) {
      this.searchContext.gebaerdenInput = this.searchContext.gebaerdenInput.replace(unicode, '');
    } else {
      this.searchContext.gebaerdenInput += unicode;
    }
    this.search();
  }

  search(): void {
    this.searching = true;
    this.searchService.search(this.searchContext).toPromise().then(result => {
      this.searchContext.searchResultEntries = result.sort(
        (a, b) => a.gebaerdenschrift.symbolIds.length - b.gebaerdenschrift.symbolIds.length);
      this.searchContext.searchResultEntries = this.searchService.filter(this.searchContext, this.searchContext.searchResultEntries);
      // tslint:disable-next-line:max-line-length
      this.visibleEndIndex = this.searchContext.searchResultEntries.length - 1 < this.visibleIndexIncrement ? this.searchContext.searchResultEntries.length - 1 : this.visibleIndexIncrement;
      this.searchResultCount = this.searchContext.searchResultEntries.length;
      this.searching = false;
      this.saveStateToStorage();
    }).catch(e => {
      this.searchContext.searchResultEntries = [];
      this.visibleEndIndex = 0;
      this.searching = false;
    });
  }

  onMenuItemHeaderClicked(menuItemName: string): void {
    this.isHandformMenuSelected = menuItemName === this.handFormMenuName ? !this.isHandformMenuSelected : false;
    this.isZweihandGebaerdenMenuSelected = menuItemName === this.zweihandGebaerdenMenuName ? !this.isZweihandGebaerdenMenuSelected : false;
    this.isKontaktMenuSelected = menuItemName === this.kontaktMenuName ? !this.isKontaktMenuSelected : false;
    this.isBewegungMenuSelected = menuItemName === this.bewegungMenuName ? !this.isBewegungMenuSelected : false;
    this.isFachgebietMenuSelected = menuItemName === this.fachgebietMenuName ? !this.isFachgebietMenuSelected : false;
    this.isUrsprungMenuSelected = menuItemName === this.ursprungMenuName ? !this.isUrsprungMenuSelected : false;
    // tslint:disable-next-line:max-line-length
    this.isVerwendungskontextMenuSelected = menuItemName === this.verwendungskontextMenuName ? !this.isVerwendungskontextMenuSelected : false;
  }

  onGebaerdeClicked(gebaerde: Gebaerde): void {
    if (this.searchContext.gebaerdenInput.includes(gebaerde.symbol)) {
      this.searchContext.gebaerdenInput = this.searchContext.gebaerdenInput.replace(gebaerde.symbol, '');
    } else {
      this.searchContext.gebaerdenInput += gebaerde.symbol;
    }

    this.search();
  }

  isGebaerdeSelected(gebaerde: Gebaerde): boolean {
    return this.searchContext.gebaerdenInput.includes(gebaerde.symbol);
  }

  onFachgebietClicked(fachgebiet: any): void {
    const isSelected = this.searchContext.fachgebietsFilter.some(f => f.title === fachgebiet.title);
    if (isSelected) {
      this.searchContext.fachgebietsFilter = this.searchContext.fachgebietsFilter.filter(f => !f.equals(fachgebiet));
    } else {
      this.searchContext.fachgebietsFilter.push(fachgebiet);
    }
    this.search();
  }

  onUrsprungClicked(ursprung: Ursprung): void {
    const isSelected = this.searchContext.ursprungFilter.some(u => u.title === ursprung.title);
    if (isSelected) {
      this.searchContext.ursprungFilter = this.searchContext.ursprungFilter.filter(u => !u.equals(ursprung));
    } else {
      this.searchContext.ursprungFilter.push(ursprung);
    }

    this.search();
  }

  onVerwendungskontextClicked(verwendungskontext: any): void {
    const isSelected = this.searchContext.verwendungskontextFilter.some(u => u.title === verwendungskontext.title);
    if (isSelected) {
      this.searchContext.verwendungskontextFilter = this.searchContext.verwendungskontextFilter.filter(v => !v.equals(verwendungskontext));
    } else {
      this.searchContext.verwendungskontextFilter.push(verwendungskontext);
    }

    this.search();
  }

  toggleMode(): void {
    if (this.useISWAFont)
    {
      document.getElementById('my-button').style.transform = 'translateX(98px)';
      this.useISWAFont = false;
      document.getElementById('iswa').innerText = 'Zeichnung';
      document.getElementById('zeichnung').innerText = 'ISWA';
      document.getElementById('zeichnung').style.transform = 'translateX(-84px)';
      document.getElementById('my-button').style.borderRadius = '0px 5px 5px 0px';
    } else {
      document.getElementById('my-button').style.transform = 'translateX(-2px)';
      this.useISWAFont = true;
      document.getElementById('iswa').innerText = 'ISWA';
      document.getElementById('zeichnung').innerText = 'Zeichnung';
      document.getElementById('zeichnung').style.transform = 'translateX(0px)';
      document.getElementById('my-button').style.borderRadius = '5px 0px 0px 5px';
    }
  }

  showMore(): void {
    if (this.visibleEndIndex < this.searchContext.searchResultEntries.length - 1) {
      this.visibleEndIndex = this.visibleEndIndex + this.visibleIndexIncrement <= this.searchContext.searchResultEntries.length - 1 ?
        this.visibleEndIndex + this.visibleIndexIncrement :
        this.searchContext.searchResultEntries.length - 1;
    }
  }
}
