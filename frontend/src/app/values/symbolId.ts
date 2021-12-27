export class SymbolId {

  constructor(readonly symbolId: string) {
    this.symbolid = symbolId;

    const parts = this.symbolId.split('-');
    this.kategorie = parts[0];
    this.klassifikation = parts[1];
    this.symbolGruppe = `${parts[0]}-${parts[1]}`;

    this.form = parts[2];
    this.variante = parts[3];
    this.bewegung = `${parts[2]}-${parts[3]}`;

    this.füllung = parts[4];
    this.rotation = parts[5];
  }

  readonly kategorie: string;
  readonly klassifikation: string;
  readonly symbolGruppe: string;

  readonly form: string;
  readonly variante: string;
  readonly bewegung: string;

  readonly füllung: string;
  readonly rotation: string;

  readonly symbolid: string;

  readonly symbolKey: string;

  readonly allophone: SymbolId[] = [];

  public static unicodeToKey(unicode: string): string {

    // https://de.wikipedia.org/wiki/Stellenwertsystem
    const decimalRadix = 10;
    const hexadecimalRadix = 16;

    const codePoint = unicode.codePointAt(0);
    const parsedCodePoint = parseInt(String(codePoint), decimalRadix);
    const symbolCode = parsedCodePoint - 0x40001;
    const base = symbolCode / 96;
    const parsedBase = parseInt(String(base), decimalRadix);
    const fill = (symbolCode - (parsedBase * 96)) / 16;
    const parsedFill = parseInt(String(fill), decimalRadix);
    const rotation = symbolCode - (parsedBase * 96) - (parsedFill * 16);
    const parsedRotation = parseInt(String(rotation), decimalRadix);

    return `S${(parsedBase + 0x100).toString(hexadecimalRadix)}${parsedFill.toString(hexadecimalRadix)}${parsedRotation.toString(hexadecimalRadix)}`;
  }

  public static keyToUnicode(key: string): string {

    const baseValue = (parseInt(key.slice(1, 4), 16) - 256) * 96;
    const fillValue = (parseInt(key.slice(4, 5), 16)) * 16;
    const rotationValue = parseInt(key.slice(5, 6), 16);
    const keyValue = 0x40001 + baseValue + fillValue + rotationValue;
    return String.fromCodePoint(keyValue);
  }

  private static symbolIdWithoutFillAndRotation(symbolId: SymbolId): SymbolId {
    const ignore = `XX`;
    return new SymbolId(`${symbolId.kategorie}-${symbolId.klassifikation}-${symbolId.form}-${symbolId.variante}-${ignore}-${ignore}`);
  }

  public setAllophone(allophone: SymbolId[]): void {
    allophone.forEach(allophon => {
      this.allophone.push(allophon);
    });
  }

  public ignoringFillAndRotation(): SymbolId {
    const newSymbolId = SymbolId.symbolIdWithoutFillAndRotation(this);
    const newAllophone = this.allophone.map(allophon => SymbolId.symbolIdWithoutFillAndRotation(allophon));
    newSymbolId.setAllophone(newAllophone);
    return newSymbolId;
  }
}
