import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-entry-title-display',
  styleUrls: ['./entry-title-display.component.scss'],
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
      // Greek alphabet, exceptions needed for german language
      const exceptions = ['Ypsilon_gr_groß_', 'Ypsilon_gr_klein_', 'My_gr_groß_', 'My_gr_klein_', 'Ny_gr_groß_', 'Ny_gr_klein_', 'Omikron_gr_groß_', 'Omikron_gr_klein_'];
      const exceptionsReplacer = ['Ypsilon (&Upsilon;)', 'Ypsilon (&upsilon;)', 'My (&Mu;)', 'My (&mu;)', 'Ny (&Nu;)', 'Ny (&nu;)', 'Omikron (&Omicron;)', 'Omikron (&omicron;)'];
      exceptions.forEach(exception => {
        regex = exception;
        matches = this.title.match(regex);
        if (matches != null) {
          matches.forEach(match => {
            const exceptionIndex = exceptions.indexOf(exception);
            const replacement = exceptionsReplacer[exceptionIndex];
            this.title = this.title.replace(match, replacement);
          });
        }
      });

      // check if greek alphabet is used
      // lowercase
      regex = '_gr_klein_';
      matches = this.title.match(regex);
      if (matches != null) {
        matches.forEach(match => {
          const replacement = '';
          this.title = this.title.replace(match, replacement);
          this.title = this.title + ' (&' + this.title.toLowerCase() + ';)';
        });
      }
      // uppercase
      regex = '_gr_groß_';
      matches = this.title.match(regex);
      if (matches != null) {
        matches.forEach(match => {
          const replacement = '';
          this.title = this.title.replace(match, replacement);
          this.title = this.title + ' (&' + this.title + ';)';
        });
      }
      regex = '@';
      matches = this.title.match(regex);
      if (matches != null) {
        matches.forEach(match => {
          this.title = '(&#64;)';
        });
      }

      regex = '@';
      matches = this.title.match(regex);
      if (matches != null) {
        matches.forEach(match => {
          this.title = '(&#64;)';
        });
      }
    }
  }
}
