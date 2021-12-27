import { Ursprung } from './ursprung';
import {LightIcons} from './lightIcons';

export class Urspuenge {

    private static readonly bestand = Ursprung.create('Bestand', LightIcons.faBooks);
    private static readonly neuschoepfung = Ursprung.create('Neuschöpfung', LightIcons.faSparkles);
    private static readonly entlehnung = Ursprung.create('Entlehnung', LightIcons.faFileImport);

    public static getAll(): any[] {
        const urspruenge = [];
        urspruenge.push(this.bestand);
        urspruenge.push(this.neuschoepfung);
        urspruenge.push(this.entlehnung);

        return urspruenge;
    }
}
