import {Fachgebiet} from './fachgebiet';
import {LightIcons} from './lightIcons';
import {IconDefinition} from '@fortawesome/free-brands-svg-icons';
import {RegularIcons} from './regularIcons';
import {SolidIcons} from './solidIcons';
import {IconStyle} from './iconStyles';

export class Fachgebiete {

  static readonly alleGebaerden = Fachgebiet.create('Alle Gebärden', LightIcons.faSignLanguage, RegularIcons.faSignLanguage, SolidIcons.faSignLanguage);

  static readonly mathematik = Fachgebiet.create('Mathematik', LightIcons.faCalculatorAlt, RegularIcons.faCalculatorAlt, SolidIcons.faCalculatorAlt);
  static readonly informatik = Fachgebiet.create('Informatik', LightIcons.faDesktop, RegularIcons.faDesktop, SolidIcons.faDesktop);
  static readonly physik = Fachgebiet.create('Physik', LightIcons.faAtomAlt, RegularIcons.faAtomAlt, SolidIcons.faAtomAlt);
  static readonly chemie = Fachgebiet.create('Chemie', LightIcons.faFlask, RegularIcons.faFlask, SolidIcons.faFlask);
  static readonly biologie = Fachgebiet.create('Biologie', LightIcons.faSeedling, RegularIcons.faSeedling, SolidIcons.faSeedling);
  static readonly geowissenschaft = Fachgebiet.create('Geowissenschaft', LightIcons.faGlobeAmericas, RegularIcons.faGlobeAmericas, SolidIcons.faGlobeAmericas);
  static readonly astronomie = Fachgebiet.create('Astronomie', LightIcons.faTelescope, RegularIcons.faTelescope, SolidIcons.faTelescope);
  static readonly medizin = Fachgebiet.create('Medizin', LightIcons.faNotesMedical, RegularIcons.faNotesMedical, SolidIcons.faNotesMedical);

  public static getAll(): any[] {
    const fachgebiete = [];
    fachgebiete.push(this.mathematik);
    fachgebiete.push(this.physik);
    fachgebiete.push(this.chemie);
    fachgebiete.push(this.biologie);
    fachgebiete.push(this.geowissenschaft);
    fachgebiete.push(this.medizin);
    fachgebiete.push(this.informatik);
    fachgebiete.push(this.astronomie);
    return fachgebiete;
  }

  public static getIconByTitle(title: string, style: IconStyle = IconStyle.light): IconDefinition {
    if (title === this.alleGebaerden.title) {
      return this.alleGebaerden.getIcon(style);
    }
    else {
      const fachgebiete = this.getAll();
      const fachgebietByName = fachgebiete.find(fachgebiet => fachgebiet.title === title);
      return fachgebietByName.getIcon(style);
    }
  }
}
