import { Verwendungskontext } from './verwendungskontext';
import {LightIcons} from './lightIcons';

export class Verwendungskontexte {

    private static readonly alltaeglich = Verwendungskontext.create('Alltäglicher Bereich', LightIcons.faCalendarDay);
    private static readonly schulisch = Verwendungskontext.create('Schulischer Bereich', LightIcons.faSchool);
    private static readonly akademisch = Verwendungskontext.create('Akademischer Bereich', LightIcons.faUniversity);

    public static getAll(): any[] {
        const verwendungskontexte = [];
        verwendungskontexte.push(this.alltaeglich);
        verwendungskontexte.push(this.schulisch);
        verwendungskontexte.push(this.akademisch);

        return verwendungskontexte;
    }
}
