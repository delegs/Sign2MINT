import { Component, EventEmitter, Input, Output } from '@angular/core';
import {SignKeyboardUnicodes} from '../values/signKeyboardUnicodes';
import {LightIcons} from '../values/lightIcons';
import {SolidIcons} from '../values/solidIcons';

@Component({
  selector: 'app-gebaerden-tastatur',
  templateUrl: './gebaerden-tastatur.component.html',
  styleUrls: ['./gebaerden-tastatur.component.css']
})

export class GebaerdenTastaturComponent {
  handformCategory = 'handformen';
  zweihandGebaerdenCategory = 'zweihandGebaerden';
  kontaktCategory = 'kontakt';
  bewegungCategory = 'bewegung';

  @Input() isFocus = true;
  @Output() isFocusChange = new EventEmitter<boolean>();
  @Output() buttonClicked = new EventEmitter<string>();
  @Input() inputString = '';


  switchIcon = LightIcons.faArrowUp;
  arrowIcon = LightIcons.faChevronDown;
  handIcon = LightIcons.faHandPaper;
  zweihandGebaerdenIcon = LightIcons.faSignLanguage;
  handsIcon = LightIcons.faHandSparkles;
  bewegungIcon = LightIcons.faRoute;
  faCheck = SolidIcons.faCheck;

  selectedSearchCategory = this.handformCategory;

  gebaerdensymbole: string[] = SignKeyboardUnicodes.handformen.map(g => g.symbol);

  isISWA = true;

  constructor() {}

  onGebaerdenTastaturClick(uniCodeString: string): void {
    this.buttonClicked.emit(uniCodeString);
  }

  isSignSelected(uniCodeString: string): boolean {
    return this.inputString.includes(uniCodeString);
  }

  toggleFont(): void {
    this.isISWA = !this.isISWA;
  }

  toggleKeyboard(): void {
    this.isFocus = !this.isFocus;
    this.isFocusChange.emit(this.isFocus);
  }

  loadCategorySymbols(categoryName: string): void {

     if (categoryName === this.handformCategory) {
       this.gebaerdensymbole = SignKeyboardUnicodes.handformen.map(g => g.symbol);
       this.selectedSearchCategory = this.handformCategory;
     }
     else if (categoryName === this.zweihandGebaerdenCategory) {
       this.gebaerdensymbole = SignKeyboardUnicodes.zweihandGebaerden.map(g => g.symbol);
       this.selectedSearchCategory = this.zweihandGebaerdenCategory;
     }
     else if (categoryName === this.kontaktCategory) {
      this.gebaerdensymbole = SignKeyboardUnicodes.kontakte.map(g => g.symbol);
      this.selectedSearchCategory = this.kontaktCategory;
    }
     else if (categoryName === this.bewegungCategory) {
      this.gebaerdensymbole = SignKeyboardUnicodes.bewegungen.map(g => g.symbol);
      this.selectedSearchCategory = this.bewegungCategory;
    }
     else {
       this.gebaerdensymbole = [];
     }
  }
}
