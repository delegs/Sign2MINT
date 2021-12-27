import {IconStyle} from './iconStyles';
import {IconDefinition} from '@fortawesome/free-brands-svg-icons';

export class Fachgebiet {

  constructor() {
  }

  title: string;
  icon: any;
  regularIcon: any;
  solidIcon: any;

  public static parse(object: any): Fachgebiet {
    const fachgebiet = new Fachgebiet();
    return Object.assign(fachgebiet, object);
  }

  public static create(title: string, lightIcon: any, regularIcon: any, solidIcon: any): Fachgebiet{
    const fachgebiet = new Fachgebiet();
    fachgebiet.title = title;
    fachgebiet.icon = lightIcon;
    fachgebiet.regularIcon = regularIcon;
    fachgebiet.solidIcon = solidIcon;
    return fachgebiet;
  }

  public getIcon(style: IconStyle = IconStyle.light): IconDefinition {
    switch (style) {
      case IconStyle.light:
        return this.icon;
      case IconStyle.regular:
        return this.regularIcon;
      case IconStyle.solid:
        return this.solidIcon;
    }
  }

  equals(other: Fachgebiet): boolean {

    if (!other) {
      return false;
    }
    return this.title === other.title;
  }
}
