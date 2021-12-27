import {Component, Input, OnInit} from '@angular/core';
import {LexiconEntry} from '../material/lexiconEntry';
import {AppSettings} from '../app.settings';
import {LocalStorageService} from '../services/local-storage.service';
import {LocalStorageEventArgs} from '../material/localStorageEventArgs';
import {LocalStorageOperation} from '../values/localStorageOperation';
import {SearchMode} from '../values/searchMode';
import {IconDefinition} from '@fortawesome/free-brands-svg-icons';
import {Fachgebiete} from '../values/fachgebiete';

@Component({
  selector: 'app-search-result-entry',
  templateUrl: './search-result-entry.component.html',
  styleUrls: ['./search-result-entry.component.css']
})
export class SearchResultEntryComponent implements OnInit {

  @Input() lexikonEintrag: LexiconEntry;
  title = '';
  showGebaerdenschrift = true;

  constructor(private localStorageService: LocalStorageService) {

    localStorageService.localStorageChangedEvent.subscribe(e => {
      const eventArgs = e as LocalStorageEventArgs;
      if (eventArgs.key === AppSettings.LocalStorageSearchMode) {
        if (eventArgs.operation === LocalStorageOperation.Set) {
          this.showGebaerdenschrift = eventArgs.value === SearchMode.DGS;
        }
        if (eventArgs.operation === LocalStorageOperation.Remove) {
          this.showGebaerdenschrift = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.showGebaerdenschrift = this.localStorageService.get(AppSettings.LocalStorageSearchMode) === SearchMode.DGS;
  }

  getIconForFachgebiet(fachgebiet: string): IconDefinition {
    return Fachgebiete.getIconByTitle(fachgebiet);
  }
}
