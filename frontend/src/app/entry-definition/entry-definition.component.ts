import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-entry-definition',
  template: '<span class="titleDisplay" [innerHTML]="definition"></span>'
})
export class EntryDefinitionComponent implements OnInit {
  @Input() definition = '';

  constructor() {
  }

  ngOnInit(): void {
    const regex = new RegExp('<(\\/)*math>', 'g');
    this.definition = this.definition.replace(regex, '$');
  }
}
