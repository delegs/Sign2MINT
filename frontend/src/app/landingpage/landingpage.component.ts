import {Component, OnInit} from '@angular/core';
import {LexiconEntryService} from '../services/lexicon-entry.service';
import {Router} from '@angular/router';
import { ScrollService } from '../services/scroll.service';
import {AppSettings} from '../app.settings';
import {LocalStorageService} from '../services/local-storage.service';
import {DeviceService} from '../services/device.service';
import {Fachgebiete} from '../values/fachgebiete';
import { SearchContext } from '../material/searchContext';
import { SearchMode } from '../values/searchMode';
import {DuotoneIcons} from '../values/duotoneIcons';
import {LightIcons} from '../values/lightIcons';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

  entryCount: number;
  iconForAll = LightIcons.faSignLanguage;
  fachgebiete = Fachgebiete.getAll();

  words = ['Eis', 'letal', 'Bär', 'Lava', 'Lot', 'aerob', 'Icon', 'Agile', 'Quant', 'RNA'];
  wordSizes = ['small', 'large', 'small', 'medium', 'small', 'large'];
  wordSizesSmMd = ['small', 'large', 'medium', 'large', 'medium', 'large', 'medium', 'large'];
  wordSizesLg = ['small', 'large', 'medium', 'small',
    'large', 'small', 'medium', 'small', 'medium', 'large'];

  constructor(
    private router: Router,
    private lexiconEntryService: LexiconEntryService,
    private scrollService: ScrollService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.lexiconEntryService.getEntryCount().subscribe(response => {
      this.entryCount = response;
    });

    this.fachgebiete.forEach(fachgebiet => {
      this.lexiconEntryService.getEntryCount(fachgebiet.title).subscribe(response => {
        fachgebiet.count = response;
      });
    });

    this.localStorageService.remove(AppSettings.LocalStorageSearchContext);
  }

  handleOpenAllEntriesByFilter(fachgebiet?: string): void {
    this.scrollService.pushPreviousScrollPosition({windowPositionY: 0 , containerPositionY: 0});
    if (fachgebiet === undefined || fachgebiet.length === 0) {
      this.router.navigateByUrl('/entries');
    } else {
      this.router.navigate(['/entries', { fachgebiet }]);
    }
  }

  navigateToSearch(searchContent: string): void {
    if ('text' === searchContent) {
      this.localStorageService.set(AppSettings.LocalStorageSearchContext, new SearchContext(SearchMode.Text));
    } else {
      this.localStorageService.set(AppSettings.LocalStorageSearchContext, new SearchContext(SearchMode.DGS));
    }
    this.router.navigate([`search/${searchContent}`]);
  }

}
