import {Component, ElementRef, AfterViewInit, OnInit, ViewChild} from '@angular/core';
import {LexiconEntryService} from '../services/lexicon-entry.service';
import {AppSettings} from '../app.settings';
import {LocalStorageService} from '../services/local-storage.service';
import {SearchMode} from '../values/searchMode';
import {SearchContext} from '../material/searchContext';
import {Fachgebiete} from '../values/fachgebiete';
import {DeviceService} from '../services/device.service';
import {Router} from '@angular/router';
import {LexiconEntry} from '../material/lexiconEntry';
import {LightIcons} from '../values/lightIcons';
import {RegularIcons} from '../values/regularIcons';
import {ConfiguresHeaderVisibility} from '../header-configurator';

@Component({
  selector: 'app-text-search',
  templateUrl: './text-search.component.html',
  styleUrls: ['./text-search.component.scss']
})

export class TextSearchComponent implements OnInit, AfterViewInit, ConfiguresHeaderVisibility {

  hideKeyboard = false;

  @ViewChild('searchInput') searchInput: ElementRef;

  show: false;
  name: string;
  faChevronLeft = LightIcons.faChevronLeft;
  faTimes = LightIcons.faTimes;
  faArrowRight = RegularIcons.faLongArrowRight;
  searchIcon = LightIcons.search;
  isClearButtonVisible = false;
  searchContext = new SearchContext(SearchMode.Text);
  lexikonentryCount = 0;
  showSuggestionText = false;
  searching = false;
  isFocus = true;

  showHeaderDesktop = true;
  showHeaderMobile = false;
  showHeaderTablet = true;

  get searchResultText(): string {

    if (this.searchContext.textInput.length === 0) {
      return 'Es liegt noch keine Eingabe vor';
    } else if (this.searching) {
      return 'Suche läuft...';
    } else {
      return `Suchergebnisse: ${this.searchContext.searchResultEntries.length} / ${this.lexikonentryCount}`;
    }
  }

  constructor(
    private localStorageService: LocalStorageService,
    private lexiconEntryService: LexiconEntryService,
    public deviceService: DeviceService,
    public element: ElementRef<HTMLElement>,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.isFocus = !this.localStorageService.get(AppSettings.LocalStorageHideKeyboard) ?? true;

    const searchMode: SearchMode = this.localStorageService.get(AppSettings.LocalStorageSearchMode);
    if (searchMode !== SearchMode.Text) {
      this.clearSearch();
    }

    this.localStorageService.set(AppSettings.LocalStorageSearchMode, SearchMode.Text);

    this.lexiconEntryService.getEntryCount().subscribe(result => {
      this.lexikonentryCount = result;
    });

    this.searchContext = this.localStorageService.get(AppSettings.LocalStorageSearchContext);
    if (this.searchContext?.textInput) {
      this.handleSearch();
    }
  }

  ngAfterViewInit(): void{
    if (this.isFocus) {
      this.searchInput.nativeElement.focus();
    }
  }

  onInput(): void {
    this.updateClearButton();
    this.handleSearch();
  }

  handleSearch(): void {

    this.searching = true;
    const searchTerm = this.searchContext.textInput;

    if (searchTerm.trim().length > 0) {
      this.lexiconEntryService.getEntriesBySearchTerm(searchTerm).toPromise().then(result => {
        this.searchContext.searchResultEntries = result.sort((le1, le2) => this.sortByFirstOccurrence(le1, le2, searchTerm));
        this.searchContext.fachgebietsFilter = [Fachgebiete.alleGebaerden];
        this.showSuggestionText = searchTerm.length > 0 && result.length === 0;
        this.searching = false;
        this.localStorageService.set(AppSettings.LocalStorageSearchContext, this.searchContext);
      }).catch(() => {
        this.searchContext.searchResultEntries = [];
        this.showSuggestionText = true;
        this.searching = false;
      });
    } else {
      this.clearSearch();
      this.searching = false;
    }
  }

  sortByFirstOccurrence(lexikonEntry1: LexiconEntry, lexikonEntry2: LexiconEntry, searchTerm: string): number {

    searchTerm = searchTerm.toLowerCase();
    const lexikonEntry1Begriff = lexikonEntry1.fachbegriff.toLowerCase();
    const lexikonEntry2Begriff = lexikonEntry2.fachbegriff.toLowerCase();
    const lexikonEntry1Occurrence = lexikonEntry1Begriff.indexOf(searchTerm);
    const lexikonEntry2Occurrence = lexikonEntry2Begriff.indexOf(searchTerm);
    const compareResult = lexikonEntry1Occurrence - lexikonEntry2Occurrence;

    if (compareResult) {
      return compareResult;
    }

    const lexikonEntry1End = lexikonEntry1Begriff.substr(lexikonEntry1Occurrence, lexikonEntry1Begriff.length - lexikonEntry1Occurrence);
    const lexikonEntry2End = lexikonEntry2Begriff.substr(lexikonEntry2Occurrence, lexikonEntry2Begriff.length - lexikonEntry2Occurrence);
    return lexikonEntry1End.localeCompare(lexikonEntry2End);
  }

  backToPreviousSite(): void {
    window.history.back();
  }

  updateClearButton(): void {
    this.isClearButtonVisible = this.searchContext.textInput.trim().length > 0;
  }

  clearSearch(): void {
    this.searchContext = new SearchContext(SearchMode.Text);
    this.localStorageService.set(AppSettings.LocalStorageSearchContext, this.searchContext);
    this.updateClearButton();
    this.showSuggestionText = false;
  }

  searchInput_OnEnter(event): void {
    const searchResult = this.searchContext.searchResultEntries;
    if (searchResult.length > 0) {
      const firstSearchResult = searchResult[0];
      const url = `/entry/${firstSearchResult.fachbegriff}`;
      this.router.navigateByUrl(url);
    }

    event.stopPropagation();
  }

  isFirstMatch(lexikonEntry: LexiconEntry): boolean {
    const searchResultEntries = this.searchContext.searchResultEntries;
    if (searchResultEntries.length > 0) {
      const firstMatch = searchResultEntries[0];
      return firstMatch.id === lexikonEntry.id;
    }
    return false;
  }
}
