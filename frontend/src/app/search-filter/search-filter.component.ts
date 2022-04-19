import { Component, OnInit } from '@angular/core';
import {Fachgebiete} from '../values/fachgebiete';
import {SearchContext} from '../material/searchContext';
import {SearchMode} from '../values/searchMode';
import {LocalStorageService} from '../services/local-storage.service';
import {AppSettings} from '../app.settings';
import {Fachgebiet} from '../values/fachgebiet';
import {Ursprung} from '../values/ursprung';
import {Urspuenge} from '../values/urspruenge';
import {Verwendungskontexte} from '../values/verwendungskontexte';
import {LightIcons} from '../values/lightIcons';
import {SearchService} from '../services/search.service';
import {SolidIcons} from '../values/solidIcons';
import {ConfiguresHeaderVisibility} from '../header-configurator';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, ConfiguresHeaderVisibility {

  faChevronUp = LightIcons.faChevronUp;
  faChevronDown = LightIcons.faChevronDown;
  faCheck = SolidIcons.checked;
  faSquare = LightIcons.faSquare;

  searchResultCount = 0;

  fachgebiete = Fachgebiete.getAll();
  urspruenge = Urspuenge.getAll();
  verwendungslkontexte = Verwendungskontexte.getAll();

  isFachgebieteSelected = true;
  isUrsprungSelected = true;
  isVerwendungskontextSelected = true;

  fachgebiet = 'Fachgebiet';
  ursprung = 'Ursprung';
  verwendungskontext = 'Verwendungskontext';

  showHeaderDesktop = false;
  showHeaderMobile = false;
  showHeaderTablet = false;

  searchContext = new SearchContext(SearchMode.DGS);

  constructor(private localStorageService: LocalStorageService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchContext = SearchContext.parse(this.localStorageService.get(AppSettings.LocalStorageSearchContext));
    this.search();
  }

  onFilterCategoryHeaderClicked(filterCategory: string): void{
    if (filterCategory === this.fachgebiet) {
      this.isFachgebieteSelected = !this.isFachgebieteSelected;
    }

    if (filterCategory === this.ursprung) {
      this.isUrsprungSelected = !this.isUrsprungSelected;
    }

    if (filterCategory === this.verwendungskontext) {
      this.isVerwendungskontextSelected = !this.isVerwendungskontextSelected;
    }
  }

  onFachgebietClicked(fachgebiet: Fachgebiet): void {
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

  saveAndGoBack(): void {
    this.localStorageService.set(AppSettings.LocalStorageSearchContext, this.searchContext);
    window.history.back();
  }

  search(): void {
    this.searchService.search(this.searchContext).subscribe(result => {
      const filteredResult = this.searchService.filter(this.searchContext, result);
      this.searchResultCount = filteredResult.length;
    });
  }

  hasFiltersApplied(): boolean {
    return this.searchContext.hasFiltersApplied();
  }

  resetFilter(): void {
    this.searchContext.fachgebietsFilter = [];
    this.searchContext.ursprungFilter = [];
    this.searchContext.verwendungskontextFilter = [];
    this.search();
  }
}
