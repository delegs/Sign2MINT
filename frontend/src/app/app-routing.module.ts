import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EntryDetailComponent} from './entry-detail/entry-detail.component';
import {EntryNotFoundComponent} from './entry-not-found/entry-not-found.component';
import {LandingpageComponent} from './landingpage/landingpage.component';
import {AlphabeticalOverviewComponent} from './alphabetical-overview/alphabetical-overview.component';
import {PageComponent} from './page/page.component';
import {ContactComponent} from './contact/contact.component';
import {SuggestionComponent} from './suggestion/suggestion.component';
import {VideoShareComponent} from './video-share/video-share.component';
import { TextSearchComponent } from './text-search/text-search.component';
import { GebaerdenschriftSearchComponent } from './gebaerdenschrift-search/gebaerdenschrift-search.component';
import {SearchFilterComponent} from './search-filter/search-filter.component';
import {ExcelImportComponent} from './excel-import/excel-import.component';

const routes: Routes = [
  {path: '', component: LandingpageComponent},
  {path: 'entry/:fachbegriff', component: EntryDetailComponent},
  {path: 'entry/:fachbegriff/:id', component: EntryDetailComponent},
  {path: 'entry-not-found/:fachbegriff', component: EntryNotFoundComponent},
  {path: 'entries', component: AlphabeticalOverviewComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'suggestion', component: SuggestionComponent},
  {path: 'page/:page-name', component: PageComponent},
  {path: 'video-share/:videoFile', component: VideoShareComponent},
  {path: 'search/text', component: TextSearchComponent},
  {path: 'search/gebaerdensuche', component: GebaerdenschriftSearchComponent},
  {path: 'search/gebaerdensuche/filter', component: SearchFilterComponent},
  {path: 'import', component: ExcelImportComponent},

  // 404 Not Found: This line needs to be at the bottom
  {path: '**', pathMatch: 'full', component: EntryNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
