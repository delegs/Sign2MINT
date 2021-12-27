import {SymbolId} from '../values/symbolId';

export class LexiconEntry {

  id = '';
  fachbegriff = '';
  videoLink = '';
  fachgebiete: string[] = [];
  ursprung: string[] = [];
  verwendungskontext: string[] = [];
  definition = '';
  empfehlung: boolean;
  wortlink = '';
  wikipedialink = '';
  otherlink = '';
  gebaerdenschrift: {
    url: '',
    symbolIds: SymbolId[],
  };

  constructor() {
  }
}
