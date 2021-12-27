import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-entry-title-display',
  styleUrls: ['./entry-title-display.component.css'],
  template: '<span class="titleDisplay titleDisplay-{{parentName}}" [innerHTML]="title"></span>'
})
export class EntryTitleDisplayComponent implements OnChanges {
  @Input() title;
  @Input() parentName;

  constructor() {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.title !== undefined) {
      let regex = '_hoch_.';
      let matches = this.title.match(regex);
      if (matches != null) {
        matches.forEach(match => {
          const replacement = '<sup>' + match[match.length - 1] + '</sup>';
          this.title = this.title.replace(match, replacement);
        });
      }
      regex = '_unten_.';
      matches = this.title.match(regex);
      if (matches != null) {
        matches.forEach(match => {
          const replacement = '<sub>' + match[match.length - 1] + '</sub>';
          this.title = this.title.replace(match, replacement);
        });
      }
    }
  }

}
