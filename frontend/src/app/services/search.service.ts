import {Injectable} from '@angular/core';
import {LexiconEntry} from '../material/lexiconEntry';
import {SearchContext} from '../material/searchContext';
import {SymbolId} from '../values/symbolId';
import {SignKeyboardUnicodes} from '../values/signKeyboardUnicodes';
import {SymbolIdService} from './symbol-id.service';
import {SearchMode} from '../values/searchMode';
import {LexiconEntryService} from './lexicon-entry.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  unicodeToSymbolIdMap = new Map<string, SymbolId>();

  constructor(private symbolIdService: SymbolIdService, private lexikonEntryService: LexiconEntryService) {
    const signKeyboardUnicodes = SignKeyboardUnicodes.getAll();
    const symbolKeysForRequest = signKeyboardUnicodes.map(unicode => SymbolId.unicodeToKey(unicode.symbol));
    const symbolKeysAsJson = JSON.stringify(symbolKeysForRequest);

    this.symbolIdService.getSymbolIdsForSymbolKeys(symbolKeysAsJson).subscribe(result => {
      result.forEach(id => {
        const symbolid = Object.assign(new SymbolId(id.symbolId), id);
        const unicode = SymbolId.keyToUnicode(symbolid.symbolKey);
        this.unicodeToSymbolIdMap.set(unicode, symbolid);
      });
    });
  }

  public search(searchContext: SearchContext): Observable<LexiconEntry[]> {
    if (searchContext.searchMode === SearchMode.DGS) {
      const input = searchContext.gebaerdenInput;
      const symbolIds = this.getSymbolIdsForUnicodeString(input);
      if (symbolIds.length === 0) {
        return new Observable<LexiconEntry[]>(obs => {
          obs.next([]);
          obs.complete();
        });
      }
      const json = JSON.stringify(symbolIds);
      return this.lexikonEntryService.getEntriesForAllSymbolIds(json);
    }
  }

  public getSymbolIdsForUnicodeString(uniCodeString: string): SymbolId[] {
    let symbolIds = [];
    const unicodes = Array.from(uniCodeString);

    for (const unicode of unicodes) {
      const symbolIdsForUnicode: SymbolId[] = [];
      const symbolIdsForZweihandGebaerden = this.getSymbolIdsForZweihandGebaerden(unicode);
      symbolIdsForZweihandGebaerden.forEach(s => symbolIdsForUnicode.push(s));
      const symbolIdsForKontaktGebaerden = this.getSymbolIdsForKontaktGebaerden(unicode);
      symbolIdsForKontaktGebaerden.forEach(s => symbolIdsForUnicode.push(s));
      const symbolIdsForBewegungsGebaerden = this.getSymbolIdsForBewegungsGebaerden(unicode);
      symbolIdsForBewegungsGebaerden.forEach(s => symbolIdsForUnicode.push(s));

      if (symbolIdsForUnicode.length === 0) {
        const selectedSymbolId = this.unicodeToSymbolIdMap.get(unicode);
        if (selectedSymbolId) {
          symbolIdsForUnicode.push(selectedSymbolId.ignoringFillAndRotation());
        }
      }

      symbolIds = symbolIds.concat(symbolIdsForUnicode);
    }

    return symbolIds;
  }


  getSymbolIdsForZweihandGebaerden(unicode: string): SymbolId[] {
    const symbolIds = [];

    switch (unicode) {
      case ('񈘁'): // Die linke Hand folgt der rechten Hand
        const followId = new SymbolId('02-03-XXX-XX-03-XX');
        const initialAllophon = new SymbolId('02-03-XXX-XX-06-XX');
        const followAllophone = [initialAllophon];
        for (let i = 3; i <= 10; i++) {
          const currentClassification = i < 10 ? `0${i}` : i;
          const followAllophon1 = new SymbolId(`02-${currentClassification}-XXX-XX-03-XX`);
          const followAllophon2 = new SymbolId(`02-${currentClassification}-XXX-XX-06-XX`);
          followAllophone.push(followAllophon1, followAllophon2);
        }
        followId.setAllophone(followAllophone);
        symbolIds.push(followId);
        break;
    }
    return symbolIds;
  }

  getSymbolIdsForBewegungsGebaerden(unicode: string): SymbolId[] {
    const symbolIds = [];

    switch (unicode) {
      case ('񆿁'): // Gerade Bewegung
      // 02-03-XXX-01-XX-XX - Länge
      // 02-03-XXX-XX-01-XX - Rechts, Links, Beide
        const straightId = new SymbolId('02-03-001-01-XX-XX');  //Fensterebene
        const initialAllophon1 = new SymbolId('02-04-001-XX-XX-XX');  //Schrägebene
        const initialAllophon2 = new SymbolId('02-05-001-01-XX-XX');  //Tischebene
        const straightAllophone = [initialAllophon1, initialAllophon2];

        for (let i = 1; i <= 6; i++) {
          if(i==1){
            for (let j = 2; j <=4; j++) {
            const straightAllophon1 = new SymbolId(`02-03-001-0${j}-XX-XX`);  // nicht 02-03-001-05-01-01, 02-03-002-02-01-01
            const straightAllophon2 = new SymbolId(`02-05-001-0${j}-XX-XX`); //ToDo: Wieso wird Devon gefunden?
            straightAllophone.push(straightAllophon1, straightAllophon2);
            }
          }
          else{
            const straightAllophon1 = new SymbolId(`02-03-00${i}-01-XX-XX`);
            const straightAllophon2 = new SymbolId(`02-05-00${i}-01-XX-XX`);
            straightAllophone.push(straightAllophon1, straightAllophon2);
          }
        }

        for (let i = 1; i <= 4; i++) {
          const straightAllophon3 = new SymbolId(`02-04-00${i}-XX-XX-XX`);
          straightAllophone.push(straightAllophon3);
        }
        straightId.setAllophone(straightAllophone);
        symbolIds.push(straightId);
        break;

      case ('񇔁'): // Eckige Bewegung 15 Suchergebnisse -> 24 -> jetzt nur 3
        const angularId = new SymbolId('02-03-007-XX-XX-XX');
        const initialAllophon4 = new SymbolId('02-05-007-XX-XX-XX');
        const angularAllophone = [initialAllophon4];
        for (let i = 8; i <= 12; i++) {
          const currentClassification = i < 10 ? `00${i}` : `0${i}`;
          const angularAllophon1 = new SymbolId(`02-03-${currentClassification}-XX-XX-XX`);
          const angularAllophon2 = new SymbolId(`02-05-${currentClassification}-XX-XX-XX`);
          angularAllophone.push(angularAllophon1, angularAllophon2);
        }
        angularId.setAllophone(angularAllophone);
        symbolIds.push(angularId);
        break;

      case ('񉥡'): // Wellenbewegung
        const waveId = new SymbolId('02-06-001-XX-XX-XX');        // bis 007 -  008 - 011 Rotation
        const waveAllophon1 = new SymbolId('02-08-001-XX-XX-XX'); // bis 004 -  005 - 007 Rotation
        const waveAllophon2 = new SymbolId('02-09-001-XX-XX-XX'); // bis 004 -  005 - 008 Rotation
        const waveAllophone = Array.of(waveAllophon1, waveAllophon2);

        for (let i = 2; i <= 7; i++) {
          const waveAllophon = new SymbolId(`02-06-00${i}-XX-XX-XX`);
          waveAllophone.push(waveAllophon);
        }
        for (let i = 2; i <= 4; i++) {
          const waveAllophon1 = new SymbolId(`02-08-00${i}-XX-XX-XX`);
          const waveAllophon2 = new SymbolId(`02-09-00${i}-XX-XX-XX`);
          waveAllophone.push(waveAllophon1, waveAllophon2);
        }

        waveId.setAllophone(waveAllophone);
        symbolIds.push(waveId);
        break;

      case ('񋔡'): // Kreisbewegung
        const circleId = new SymbolId('02-10-XXX-XX-XX-XX');
        symbolIds.push(circleId);
        break;

      // Fenster: einfach: 񇻁 zweifach: 񇼡 񇾁
      case ('񇼡'): // Gerader Pfeil plus Spirale -> keine gerade Bewegungsspur sondern Spirale
        const spiralId = new SymbolId('02-03-020-XX-XX-XX');
        const spiralAllophon1 = new SymbolId('02-06-005-XX-XX-XX'); // Bewegung mit Looping
        const spiralAllophon2 = new SymbolId('02-08-003-XX-XX-XX');
        const spiralAllophon3 = new SymbolId('02-08-010-XX-XX-XX');
        const spiralAllophon4 = new SymbolId('02-09-003-XX-XX-XX');
        const spiralAllophone = Array.of(spiralAllophon1, spiralAllophon2, spiralAllophon3, spiralAllophon4);
        spiralId.setAllophone(spiralAllophone);
        symbolIds.push(spiralId);
        break;

      case ('񆸁'): // Fingergelenkbewegung
        const fingerId = new SymbolId('02-02-XXX-XX-XX-XX');
        symbolIds.push(fingerId);
        break;

      case ('񇅁'): // Handgelenkbewegung, auch 񊔁 ?
        const handId = new SymbolId('02-03-001-05-XX-XX');         // hin - Fensterebene
        const handAllophon1 = new SymbolId('02-03-002-02-XX-XX');  // 2x hin
        const handAllophon2 = new SymbolId('02-03-003-02-XX-XX');  // hin und her, '02-03-005-02
        const handAllophon3 = new SymbolId('02-03-006-02-XX-XX');  // hin und her und wieder hin
        const handAllophon4 = new SymbolId('02-05-001-05-XX-XX');  // hin - Tischebene
        const handAllophon5 = new SymbolId('02-05-002-02-XX-XX');  // 2x hin
        const handAllophon6 = new SymbolId('02-05-003-02-XX-XX');  // hin und her, '02-05-005-02
        const handAllophon7 = new SymbolId('02-05-006-02-XX-XX');  // hin und her und wieder hin
        const handAllophon8 = new SymbolId('02-10-005-XX-XX-XX');  // Handrotation frontal
        const handAllophon9 = new SymbolId('02-10-006-XX-XX-XX');  // Handrotation seitlich
        const handAllophone = Array.of(handAllophon1, handAllophon2, handAllophon3, handAllophon4, handAllophon5,
          handAllophon6, handAllophon7, handAllophon8, handAllophon9);
        handId.setAllophone(handAllophone);
        symbolIds.push(handId);
        break;

      case ('񋎡'): // Armrotationsbewegung 񋎡
        // table
        const armRId = new SymbolId('02-06-008-01-XX-XX');         // 񉳁
        const armRAllophon1 = new SymbolId('02-06-009-01-XX-XX');  // 񉴡
        const armRAllophon2 = new SymbolId('02-06-010-01-XX-XX');  // 񉶁
        const armRAllophon3 = new SymbolId('02-06-011-01-XX-XX');  // 񉷡
        // window
        const armRAllophon4 = new SymbolId('02-09-005-01-XX-XX');  // 񋎡
        const armRAllophon5 = new SymbolId('02-09-006-01-XX-XX');
        const armRAllophon6 = new SymbolId('02-09-007-01-XX-XX');
        const armRAllophon7 = new SymbolId('02-09-008-01-XX-XX');

        const armRAllophon8 = new SymbolId('02-08-005-01-XX-XX'); // 񊤡
        const armRAllophon9 = new SymbolId('02-08-006-01-XX-XX');
        const armRAllophon10 = new SymbolId('02-08-007-01-XX-XX');
        const armRAllophon11 = new SymbolId('02-08-012-01-XX-XX'); // 񊻁
        const armRAllophon12 = new SymbolId('02-08-013-01-XX-XX');
        const armRAllophon13 = new SymbolId('02-08-014-01-XX-XX');

        const armRAllophone = Array.of(armRAllophon1, armRAllophon2, armRAllophon3, armRAllophon4, armRAllophon5,
          armRAllophon6, armRAllophon7, armRAllophon8, armRAllophon9, armRAllophon10, armRAllophon11,
          armRAllophon12, armRAllophon13);
        armRId.setAllophone(armRAllophone);
        symbolIds.push(armRId);
        break;

      case ('񇵁'): // Armrotationsbewegung mit gerader Bewegung
        const armRBId = new SymbolId('02-03-013-01-XX-XX');
        const initialAllophon3 = new SymbolId('02-05-013-01-XX-XX');
        const armRBAllophone = [initialAllophon3];
        for (let i = 14; i <= 19; i++) {
          const armRBAllophon1 = new SymbolId(`02-03-0${i}-XX-XX-XX`); // 񇵁-  Fensterebene
          const armRBAllophon2 = new SymbolId(`02-05-0${i}-XX-XX-XX`); // 񉆁 - Tischebene
          armRBAllophone.push(armRBAllophon1, armRBAllophon2);
        }
        armRBId.setAllophone(armRBAllophone);
        symbolIds.push(armRBId);
        break;
    }
    return symbolIds;
  }

  getSymbolIdsForKontaktGebaerden(unicode: string): SymbolId[] {
    const symbolIds = [];

    switch (unicode) {
      case ('񆇡'): // Berührungskontakt
        const touchId = new SymbolId('02-01-001-XX-XX-XX');
        const touchAllophon1 = new SymbolId('02-01-002-XX-XX-XX');
        const touchAllophon2 = new SymbolId('02-01-003-XX-XX-XX');
        const touchAllophone = Array.of(touchAllophon1, touchAllophon2);
        touchId.setAllophone(touchAllophone);
        symbolIds.push(touchId);
        break;

      case ('񆕁'): // Wischkontakt񆕁
        const swipeId = new SymbolId('02-01-010-XX-XX-XX');
        const swipeAllophon1 = new SymbolId('02-01-011-XX-XX-XX');
        const swipeAllophon2 = new SymbolId('02-01-012-XX-XX-XX');
        const swipeAllophone = Array.of(swipeAllophon1, swipeAllophon2);
        swipeId.setAllophone(swipeAllophone);
        symbolIds.push(swipeId);
        break;

      case ('񆙡'): // Reibekontakt
        const rubId = new SymbolId('02-01-013-XX-XX-XX');
        const rubAllophon1 = new SymbolId('02-01-014-XX-XX-XX');
        const rubAllophon2 = new SymbolId('02-01-015-XX-XX-XX');
        const rubAllophone = Array.of(rubAllophon1, rubAllophon2);
        rubId.setAllophone(rubAllophone);
        symbolIds.push(rubId);
        break;

      case ('񆌁'): // Greifkontakt
        const grabId = new SymbolId('02-01-004-XX-XX-XX');
        const grabAllophon1 = new SymbolId('02-01-005-XX-XX-XX');
        const grabAllophon2 = new SymbolId('02-01-006-XX-XX-XX');
        const grabAllophone = Array.of(grabAllophon1, grabAllophon2);
        grabId.setAllophone(grabAllophone);
        symbolIds.push(grabId);
        break;

      case ('񌀁'):  // Kontakt mit Kopf 21
        const headId = new SymbolId('04-01-002-XX-XX-XX');
        const headAllophon1 = new SymbolId('04-03-003-01-XX-XX');
        const headAllophon2 = new SymbolId('04-03-004-XX-XX-XX');
        const headAllophone = Array.of(headAllophon1, headAllophon2);
        headId.setAllophone(headAllophone);
        symbolIds.push(headId);
        break;

      case ('񎱃'):  // Kontakt mit Arm 20
        const armId = new SymbolId('05-02-002-01-XX-XX');
        const armAllophon1 = new SymbolId('05-02-002-02-XX-XX');
        const armAllophon2 = new SymbolId('05-02-002-03-XX-XX'); // bis 004 -  005 - 008 eher Rotation?
        const armAllophone = Array.of(armAllophon1, armAllophon2);
        armId.setAllophone(armAllophone);
        symbolIds.push(armId);
        break;
    }
    return symbolIds;
  }

  public filter(searchContext: SearchContext, searchResult: LexiconEntry[]): LexiconEntry[] {
    let filteredResult = searchResult;

    if (searchContext.fachgebietsFilter.length > 0) {
      filteredResult = filteredResult.filter(
        e => e.fachgebiete.some(
          f => searchContext.fachgebietsFilter.some(
            sf => f.toLowerCase() === sf.title.toLowerCase())));
    }
    if (searchContext.ursprungFilter.length > 0) {
      filteredResult = filteredResult.filter(
        e => e.ursprung.some(
          u => searchContext.ursprungFilter.some(
            su => u.toLowerCase() === su.title.toLowerCase())));
    }
    if (searchContext.verwendungskontextFilter.length > 0) {
      filteredResult = filteredResult.filter(
        e => e.verwendungskontext.some(
          v => searchContext.verwendungskontextFilter.some(
            sv => v.toLowerCase() === sv.title.toLowerCase())));
    }

    return filteredResult;
  }
}
