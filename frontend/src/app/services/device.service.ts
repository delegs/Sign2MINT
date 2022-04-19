import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private window: Window) { }

  /**
   * @deprecated Should be done via CSS
   */
  isMobile(): boolean{
    return this.convertVarToBoolean('--is-mobile');
  }

  /**
   * @deprecated Should be done via CSS
   */
  isTablet(): boolean{
    return this.convertVarToBoolean('--is-tablet');
  }

  /**
   * @deprecated Should be done via CSS.
   * To show an element on desktop only, for example, use Tailwind classes: 'hidden lg:block'
   */
  isDesktop(): boolean{
    return this.convertVarToBoolean('--is-desktop');
  }

  private convertVarToBoolean(variable: string): boolean {
    const value = getComputedStyle(document.body).getPropertyValue(variable);
    return value === 'true' ? true : false;
  }
}
