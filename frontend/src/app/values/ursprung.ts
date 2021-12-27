export class Ursprung {

  constructor() {
  }

  title: string;
  icon: any;
  description: string;

  public static parse(object: any): Ursprung {
    const ursprung = new Ursprung();
    Object.assign(ursprung, object);
    return ursprung;
  }

  public static create(title: string, icon: any): Ursprung{
    const ursprung = new Ursprung();
    ursprung.title = title;
    ursprung.icon = icon;
    return ursprung;
  }

  equals(other: Ursprung): boolean {

    if (!other) {
      return false;
    }
    return this.title === other.title;
  }
}
