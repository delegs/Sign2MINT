/* tslint:disable:no-trailing-whitespace */
import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {LexiconEntryService} from '../services/lexicon-entry.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AppSettings} from '../app.settings';
import {LexiconEntry} from '../material/lexiconEntry';
import {ScrollService} from '../services/scroll.service';
import {DeviceService} from '../services/device.service';
import {LocalStorageService} from '../services/local-storage.service';
import {SearchContext} from '../material/searchContext';
import {SearchMode} from '../values/searchMode';
import {Fachgebiete} from '../values/fachgebiete';
import {IconDefinition} from '@fortawesome/free-brands-svg-icons';
import {IconStyle} from '../values/iconStyles';

@Component({
  selector: 'app-alphabetical-overview',
  templateUrl: './alphabetical-overview.component.html',
  styleUrls: ['./alphabetical-overview.component.scss']
})
export class AlphabeticalOverviewComponent implements OnInit, OnDestroy {
  alphabet = [];
  activeLetter = [];
  subscriptionEvent: Subscription;
  currentFilter = '';
  currentFachgebiet = 'Alle Gebärden';
  currentEntryCount = 0;
  scrollcontainer: HTMLElement;
  alphabetNavigation: HTMLElement;
  scrollingReady = false;

  selectedAlphabetIndex = 0;
  selectedEntryIndex = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lexiconEntryService: LexiconEntryService,
              private scrollService: ScrollService,
              private deviceService: DeviceService,
              private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.scrollcontainer = document.getElementsByClassName('card-container')[0] as HTMLElement;
    this.alphabetNavigation = document.getElementById('navigationContainer');

    this.subscriptionEvent = this.route.params.subscribe(routeParams => {
      this.currentFilter = '';
      this.currentFachgebiet = 'Alle Gebärden';
      if (routeParams.fachgebiet) {
        this.currentFachgebiet = routeParams.fachgebiet;
        this.currentFilter = `;fachgebiet=${routeParams.fachgebiet}`;
      }
      this.lexiconEntryService.getEntryCount(routeParams.fachgebiet).subscribe(response => {
        this.currentEntryCount = response;
      });

      this.initAlphabet(routeParams.fachgebiet);

    });
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.subscriptionEvent.unsubscribe();
  }

  async initAlphabet(fachgebiet: string): Promise<void> {
    this.alphabet = this.initEmptyAlphabet();

    const promisesForCharacters: Promise<LexiconEntry[]>[] = Array.from(Array(26).keys()).map(index =>
      this.lexiconEntryService.getAllEntriesForCharacter(String.fromCharCode(index + 65), fachgebiet).toPromise()
        .then(entriesForCharacter => this.alphabet[index].entries.push(...entriesForCharacter)));

    promisesForCharacters.push(
      this.lexiconEntryService.getAllEntriesForCharacter('0-9', fachgebiet).toPromise()
        .then(entriesForCharacter => this.alphabet[26].entries.push(...entriesForCharacter))
    );

    promisesForCharacters.push(
      this.lexiconEntryService.getAllEntriesForCharacter('Ä', fachgebiet).toPromise()
        .then(entriesForCharacter => this.alphabet[0].entries.push(...entriesForCharacter))
    );

    promisesForCharacters.push(
      this.lexiconEntryService.getAllEntriesForCharacter('Ö', fachgebiet).toPromise()
        .then(entriesForCharacter => this.alphabet[14].entries.push(...entriesForCharacter))
    );

    promisesForCharacters.push(
      this.lexiconEntryService.getAllEntriesForCharacter('Ü', fachgebiet).toPromise()
        .then(entriesForCharacter => this.alphabet[20].entries.push(...entriesForCharacter))
    );

    promisesForCharacters.push(
      this.lexiconEntryService.getAllEntriesForCharacter('@', fachgebiet).toPromise()
        .then(entriesForCharacter => this.alphabet[0].entries.push(...entriesForCharacter))
    );

    await Promise.all(promisesForCharacters);

    this.scrollingReady = true;
    this.onScrollWindow({});

    const previousScrollPosition = this.scrollService.getPreviousScrollPosition();
    if (this.deviceService.isMobile()) {
      this.scrollcontainer.scrollTop = previousScrollPosition.containerPositionY;
    }

    window.scrollTo({top: previousScrollPosition.windowPositionY, behavior: 'auto'});

    const searchContext = new SearchContext(SearchMode.Text);
    const allFachgebiete = Fachgebiete.getAll();
    const selectedFachgebiet = allFachgebiete.find(f => f.title === fachgebiet);
    if (selectedFachgebiet) {
      searchContext.fachgebietsFilter.push(selectedFachgebiet);
    }
    searchContext.searchResultEntries = this.alphabet.reduce((entries, alphabetEntry) => entries.concat(alphabetEntry.entries), []);
    this.localStorageService.set(AppSettings.LocalStorageSearchContext, searchContext);
  }

  navigateToChar(hash: string): void {
    window.location.hash = hash;

    const element = document.getElementById(hash);
    const overviewTop = document.getElementById('overview-top');
    let headerOffset = 0;
    try {
      const header = document.getElementsByTagName('app-header')[0] as HTMLElement;
      headerOffset = header.offsetHeight;
    }
    finally {
      const yOffset = overviewTop.offsetHeight + headerOffset;
      console.log('Offset Height: ', yOffset);
      const y = element.offsetTop - yOffset;

      if (this.deviceService.isMobile()) {
        window.scrollTo(0, 0);
        // element.scrollIntoView({behavior: 'smooth'});
      } else {
        window.scrollTo({top: y, behavior: 'smooth'});
      }

      const cssClassQuerySelectorsForOuterCard = Array.from(document.querySelectorAll('.outer-card'));
      const sortedCssClassQuerySelectorsForOuterCard = cssClassQuerySelectorsForOuterCard.sort();
      this.focusElementByChar(hash, sortedCssClassQuerySelectorsForOuterCard);
    }
  }

  initEmptyAlphabet(): any[] {
    const alphabet = Array.from(Array(26).keys()).map(index => ({
      character: String.fromCharCode(index + 65),
      entries: []
    }));

    alphabet[26] = {
      character: '0-9',
      entries: []
    };

    return alphabet;
  }

  navigateToFachbegriff(fachbegriff: string): void {
    this.scrollService.pushPreviousScrollPosition({
      windowPositionY: window.pageYOffset,
      containerPositionY: this.scrollcontainer.scrollTop
    });
    this.router.navigate([`entry/${fachbegriff}`]);
  }

  @HostListener('window:scroll', ['$event'])
  onScrollWindow(event: any): void {
    if (!this.scrollingReady) {
      return;
    }
    if (this.deviceService.isMobile()) {
      this.onScrollMobile();
      return;
    }

    this.activeLetter = [];
    const containerYOffset = this.deviceService.isDesktop() ? 200 : this.deviceService.isTablet() ? 170 : 150;
    const sectionYOffset = 25;

    for (const letterContainer of Array.from(this.scrollcontainer.getElementsByClassName('card-category'))) {
      const rect = letterContainer.getBoundingClientRect();
      if (rect.top + sectionYOffset >= window.innerHeight) {
        break;
      }
      if (rect.bottom - sectionYOffset >= containerYOffset || rect.top + sectionYOffset >= containerYOffset) {
        this.activeLetter.push(letterContainer.getElementsByTagName('h4')[0].textContent);
      }
    }
  }

  onScrollMobile(): void {
    if (!this.scrollingReady) {
      return;
    }

    this.activeLetter = [];
    const sectionYOffset = 25;

    const scrollContainerBBTop = this.deviceService.isDesktop() ? 200 : this.deviceService.isTablet() ? 170 : 150;
    const scrollContainerBBBot = this.scrollcontainer.getBoundingClientRect().bottom;

    for (const letterContainer of Array.from(this.scrollcontainer.getElementsByClassName('card-category'))) {
      const rect = letterContainer.getBoundingClientRect();
      const letterContainerBBTop = rect.top + sectionYOffset;
      const letterContainerBBBot = rect.bottom - sectionYOffset;

      if (letterContainerBBTop >= scrollContainerBBBot || letterContainerBBTop >= window.innerHeight) {
        break;
      }

      if (letterContainerBBBot >= scrollContainerBBTop || letterContainerBBTop >= scrollContainerBBBot) {
        this.activeLetter.push(letterContainer.getElementsByTagName('h4')[0].textContent);
      }
    }
  }

  navigationContainerOnArrowKeyDown(isRightArrow: boolean): void {

    const characters = document.querySelectorAll('.letterWrapper');

    if (isRightArrow && characters.length > this.selectedAlphabetIndex + 1) {
      this.selectedAlphabetIndex++;
    } else if (!isRightArrow && this.selectedAlphabetIndex >= 1) {
      this.selectedAlphabetIndex--;
    }

    const selectedElement = characters[this.selectedAlphabetIndex] as HTMLElement;

    selectedElement.focus();

  }

  navigationContainerOnFocus(): void {
    const characters = document.querySelectorAll('.letterWrapper');
    const selectedElement = characters[this.selectedAlphabetIndex] as HTMLElement;
    selectedElement.focus();
  }

  cardContainerOnFocus(): void {
    const characters = document.querySelectorAll('.outer-card');
    const selectedElement = characters[this.selectedEntryIndex] as HTMLElement;
    selectedElement.focus();
  }

  cardContainerOnArrowKeyDown(isRightArrow: boolean): void {
    const characters = document.querySelectorAll('.outer-card');

    if (isRightArrow && characters.length > this.selectedEntryIndex + 1) {
      this.selectedEntryIndex++;
    } else if (!isRightArrow && this.selectedEntryIndex >= 1) {
      this.selectedEntryIndex--;
    }

    const selectedElement = characters[this.selectedEntryIndex] as HTMLElement;
    selectedElement.focus();
  }

  // tslint:disable-next-line:cyclomatic-complexity
  cardContainerOnKeyDown(event: KeyboardEvent): void {
    const fachbegriffe = Array.from(document.querySelectorAll('.outer-card')).sort();
    const charCode = event.key.charCodeAt(0);

    if (event.key === 'ArrowRight' && fachbegriffe.length > this.selectedEntryIndex + 1) {
      this.cardContainerOnArrowKeyDown(true);
    } else if (event.key === 'ArrowLeft' && this.selectedEntryIndex >= 1) {
      this.cardContainerOnArrowKeyDown(false);
    } else if (event.key.length === 1) {

      const isLetter = (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
      const isNumber = charCode >= 48 && charCode <= 57;

      if (isLetter) {
        this.navigateToChar(event.key.toUpperCase());
      } else if (isNumber) {
        this.navigateToChar('0-9');
      }
      if (isLetter || isNumber) {
        this.focusElementByChar(event.key, fachbegriffe);
      }
    }
  }

  focusElementByChar(character: string, fachbegriffe: Element[]): void {
    fachbegriffe.find((e, id) => {
      this.selectedEntryIndex = id;
      return e.textContent.toLowerCase().startsWith(character.toLowerCase());
    });

    const fachbegriffToFocus = fachbegriffe[this.selectedEntryIndex] as HTMLElement;
    fachbegriffToFocus.focus();
  }

  getIconForFachgebiet(fachgebiet: string): IconDefinition {
    return Fachgebiete.getIconByTitle(fachgebiet, IconStyle.solid);
  }
}
