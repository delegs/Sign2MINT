export interface ConfiguresHeaderVisibility {
  showHeaderMobile: boolean;
  showHeaderTablet: boolean;
  showHeaderDesktop: boolean;
}

export function canConfigureHeaderVisibility(object: any): object is ConfiguresHeaderVisibility {
  return 'showHeaderMobile' in object
      && 'showHeaderTablet' in object
      && 'showHeaderDesktop' in object;
}

