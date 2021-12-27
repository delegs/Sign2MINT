import {SymbolId} from './symbolId';

describe('SymbolId', () => {

  // Unicode > SymbolKey

  it('unicode value U+40001 (񀀁) should be symbol key value S10000', () => {

    const unicode = '񀀁';
    const expectedKey = 'S10000';
    const convertedValue = SymbolId.unicodeToKey(unicode);
    expect(convertedValue).toBe(expectedKey);
  });

  it('unicode value U+41c81 (񁲁) should be symbol key value S14c00', () => {

    const unicode = '񁲁';
    const expectedKey = 'S14c00';
    const convertedValue = SymbolId.unicodeToKey(unicode);
    expect(convertedValue).toBe(expectedKey);
  });

  it('unicode value U+40061 (񀁡) should be symbol key value S10100', () => {

    const unicode = '񀁡';
    const expectedKey = 'S10100';
    const convertedValue = SymbolId.unicodeToKey(unicode);
    expect(convertedValue).toBe(expectedKey);
  });

  it('unicode value U+41d51 (񁵑) should be symbol key value S14e10', () => {

    const unicode = '񁵑';
    const expectedKey = 'S14E10';
    const convertedValue = SymbolId.unicodeToKey(unicode);
    expect(convertedValue).not.toBe(expectedKey);
  });

  it('unicode value U+4BE25 (񋸥) should be symbol key value S2fb04', () => {

    const unicode = '񋸥';
    const expectedKey = 'S2fb04';
    const convertedValue = SymbolId.unicodeToKey(unicode);
    expect(convertedValue).toBe(expectedKey);
  });

  // SymbolKey > Unicode

  it('symbol key value S10000 should be unicode value U+40001 (񀀁)', () => {

    const symbolKey = 'S10000';
    const expectedUnicode = '񀀁';
    const convertedValue = SymbolId.keyToUnicode(symbolKey);
    expect(convertedValue).toBe(expectedUnicode);
  });

  it('symbol key value S14c00 should be unicode value U+41c81 (񁲁)', () => {

    const symbolKey = 'S14c00';
    const expectedUnicode = '񁲁';
    const convertedValue = SymbolId.keyToUnicode(symbolKey);
    expect(convertedValue).toBe(expectedUnicode);
  });

});



