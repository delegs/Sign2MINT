import {Gebaerde} from './gebaerde';

export class SignKeyboardUnicodes {
  public static readonly handformen = [
    new Gebaerde('񃛁', 'I-Handform'),
    new Gebaerde('񀀁', 'Zeigefinger'),
    new Gebaerde('񀕁', 'V-Handform'),
    new Gebaerde('񀭁', '3-Handform'),
    new Gebaerde('񁦁', '4-Handform'),
    new Gebaerde('񁲁', '5-Handform'),
    new Gebaerde('񂇁', 'Flachhand'),
    new Gebaerde('񂩡', 'gekrümmte Flachhand'),

    new Gebaerde('񃧁', 'Y-Handform'),
    new Gebaerde('񀏁', 'gekrümmter Zeigefinger'),
    new Gebaerde('񀘁', 'gekrümmte V-Handform'),
    new Gebaerde('񀼁', 'gekrümmte 3-Handform'),
    new Gebaerde('񁧡', 'gekrümmte 4-Handform'),
    new Gebaerde('񁼡', 'gekrümmte 5-Handform'),
    new Gebaerde('񂣡', 'C-Handform'),
    new Gebaerde('񂻡', 'offene Schnabelform'),

    new Gebaerde('񅯡', '1-Handform'),
    new Gebaerde('񅊁', 'L-Handform'),
    new Gebaerde('񀟡', 'U-Handform'),
    new Gebaerde('񄧡', 'Kritikhandform?'),
    new Gebaerde('񄸁', 'offene F-Handform'),
    new Gebaerde('񄵁', 'F-Handform'),
    new Gebaerde('񂱁', 'O-Handform'),
    new Gebaerde('񃇡', 'geschlossene Schnabelform'),

    new Gebaerde('񅑡', 'gekrümmte L-Handform'),
    new Gebaerde('񅣡', 'Baby C-Handform'),
    new Gebaerde('񅦡', 'offene Pinzetteform'),
    new Gebaerde('񅮁', 'geschlossene Pinzetteform'),
    new Gebaerde('񅟁', 'Zügelhand'),
    new Gebaerde('񆄡', 'S-Handform')
  ];

  public static readonly zweihandGebaerden = [
    new Gebaerde('񋺅', 'parallel'),
    new Gebaerde('񋸥', 'symmetrisch'),
    new Gebaerde('񋻥', 'alternierend'),
    new Gebaerde('񋵡', 'nicht dominante Hand ist passiv'),
    new Gebaerde('񈘁', 'beide Hände führen im Kontakt die Bewegung aus')
  ];

  public static readonly kontakte = [
    new Gebaerde('񆇡', 'einfacher Kontakt'),
    new Gebaerde('񆕁', 'Wischkontakt'),
    new Gebaerde('񆙡', 'Reibkontakt'),
    new Gebaerde('񆌁', 'Greifkontakt'),
    new Gebaerde('񌀁', 'Kopf'),
    new Gebaerde('񎟁', 'Hals'),
    new Gebaerde('񎣡', 'Oberkörper'),
    new Gebaerde('񎱃', 'Arm'),
  ];

  public static readonly bewegungen = [
    new Gebaerde('񆿁', 'gerade'),
    new Gebaerde('񇔁', 'eckig'),
    new Gebaerde('񉥡', 'wellenartig'),
    new Gebaerde('񋔡', 'kreisförmig'),
    new Gebaerde('񇼡', 'spiralförmig'),
    new Gebaerde('񇵁', 'Unterarmrotation mit Pfadbewegung'),
    new Gebaerde('񋎡', 'Unterarmrotation'),
    new Gebaerde('񇅁', 'Handgelenkbewegung'),
    new Gebaerde('񆸁', 'Fingerbewegung')
  ];

  public static getAll(): Gebaerde[] {
    return [].concat(this.handformen, this.zweihandGebaerden, this.kontakte, this.bewegungen);
  }
}
