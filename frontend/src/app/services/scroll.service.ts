import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  previousScrollPositions: ScrollPosition[] = [];

  constructor() {}

  public getPreviousScrollPosition(): ScrollPosition {
    if (!this.previousScrollPositions.length) {
      return {windowPositionY : 0, containerPositionY: 0};
    }
    return this.previousScrollPositions.pop();
  }

  public pushPreviousScrollPosition(position: ScrollPosition): void {
    this.previousScrollPositions.push(position);
  }
}

class ScrollPosition {
  windowPositionY: number;
  containerPositionY: number;
}
