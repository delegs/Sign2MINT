export class Verwendungskontext {

  constructor() {

  }

  title: string;
  icon: any;

  public static parse(object: any): Verwendungskontext {
    const verwendungskontext = new Verwendungskontext();
    Object.assign(verwendungskontext, object);
    return verwendungskontext;
  }

  public static create(title: string, icon: any): Verwendungskontext{
    const verwendungskontext = new Verwendungskontext();
    verwendungskontext.title = title;
    verwendungskontext.icon = icon;
    return verwendungskontext;
  }

  equals(other: Verwendungskontext): boolean {

    if (!other) {
      return false;
    }
    return this.title === other.title;
  }
}
