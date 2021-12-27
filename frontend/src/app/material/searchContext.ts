import {Fachgebiet} from '../values/fachgebiet';
import {SearchMode} from '../values/searchMode';
import {SignKeyboardUnicodes} from '../values/signKeyboardUnicodes';
import {Ursprung} from '../values/ursprung';
import {Verwendungskontext} from '../values/verwendungskontext';
import {LexiconEntry} from './lexiconEntry';

export class SearchContext {

  constructor(searchMode: SearchMode) {
    this.searchMode = searchMode;
  }

  textInput = '';
  gebaerdenInput = '';
  fachgebietsFilter: Fachgebiet[] = [];
  ursprungFilter: Ursprung[] = [];
  verwendungskontextFilter: Verwendungskontext[] = [];
  searchResultEntries: LexiconEntry[] = [];
  searchMode: SearchMode;

  public static parse(object: any): SearchContext {
    const searchContext = new SearchContext(SearchMode.DGS);

    if (!object) {
      return searchContext;
    }

    Object.assign(searchContext, object);

    if (object.fachgebietsFilter) {
      searchContext.fachgebietsFilter = [];
      object.fachgebietsFilter.forEach(f => {
        searchContext.fachgebietsFilter.push(Fachgebiet.parse(f));
      });
    }

    if (object.ursprungFilter) {
      searchContext.ursprungFilter = [];
      object.ursprungFilter.forEach(u => {
        searchContext.ursprungFilter.push(Ursprung.parse(u));
      });
    }

    if (object.verwendungskontextFilter) {
      searchContext.verwendungskontextFilter = [];
      object.verwendungskontextFilter.forEach(v => {
        searchContext.verwendungskontextFilter.push(Verwendungskontext.parse(v));
      });
    }

    return searchContext;
  }

  /**
   * Returns the search input depending from search mode.
   * That means, if search mode is 'Text' then it returns
   * textInpunt otherwise gebaerdenInput.
   */
  public getSearchInput(): string {
    return this.searchMode === SearchMode.Text ? this.textInput : this.gebaerdenInput;
  }

  public includesFachgebiet(fachgebiet: Fachgebiet): boolean {
    return this.fachgebietsFilter.some(f => f.equals(fachgebiet));
  }

  public includesUrsprung(ursprung: Ursprung): boolean {
    return this.ursprungFilter.some(u => u.equals(ursprung));
  }

  public includesVerwendungskontext(verwendungskontext: Verwendungskontext): boolean {
    return this.verwendungskontextFilter.some(v => v.equals(verwendungskontext));
  }

  public includes2HandGebaerde(): boolean {
    const zweihandGebaerden = SignKeyboardUnicodes.zweihandGebaerden;
    const seachInput = Array.from(this.gebaerdenInput);
    return seachInput.some(gebaerde => zweihandGebaerden.map(g => g.symbol).includes(gebaerde));
  }

  public includesHandformen(): boolean {
    const handformen = SignKeyboardUnicodes.handformen;
    const seachInput = Array.from(this.gebaerdenInput);
    return seachInput.some(gebaerde => handformen.map(g => g.symbol).includes(gebaerde));
  }

  public includesKontakte(): boolean {
    const kontakte = SignKeyboardUnicodes.kontakte;
    const seachInput = Array.from(this.gebaerdenInput);
    return seachInput.some(gebaerde => kontakte.map(g => g.symbol).includes(gebaerde));
  }

  public includesBewegungen(): boolean {
    const bewegungen = SignKeyboardUnicodes.bewegungen;
    const seachInput = Array.from(this.gebaerdenInput);
    return seachInput.some(gebaerde => bewegungen.map(g => g.symbol).includes(gebaerde));
  }

  public hasFiltersApplied(): boolean {
    return this.fachgebietsFilter.length > 0 || this.ursprungFilter.length > 0 || this.verwendungskontextFilter.length > 0;
  }
}
