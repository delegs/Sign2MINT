import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly SMALL_MOBILE_MAX_WIDTH = 391;
  private readonly TABLET_MIN_WIDTH = 768;
  private readonly DESKTOP_MIN_WIDTH = 1024;
  constructor(private window: Window) { }

  isMobile(): boolean{
    return this.window.innerWidth < this.TABLET_MIN_WIDTH;
  }

  isTablet(): boolean{
    return this.window.innerWidth >= this.TABLET_MIN_WIDTH && this.window.innerWidth < this.DESKTOP_MIN_WIDTH;
  }

  isDesktop(): boolean{
    return this.window.innerWidth >= this.DESKTOP_MIN_WIDTH;
  }

  isSmallMobile(): boolean{
    return this.window.innerWidth < this.SMALL_MOBILE_MAX_WIDTH;
  }
}
