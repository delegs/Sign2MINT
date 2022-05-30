import {Component, ElementRef, OnInit} from '@angular/core';
import {findAttributeOnElementWithTag} from '@angular/cdk/schematics';

@Component({
  selector: 'app-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss']
})
export class PhotoGridComponent implements OnInit {
  staggerTime = 150;
  gridArray: Cell[] = [];
  isShowingFront = true;
  isAnimating = false;
  imageURLs = [
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Apoptose_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_APOPTOSE.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Axolotl_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_AXOLOTL.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Byte_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_BYTE.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Diode_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_DIODE.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_DNA_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_DNA.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Entropie_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_ENTROPIE.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Fossil_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_FOSSIL.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Gorilla_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_GORILLA.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Kamptozoa_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_KAMPTOZOA.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Konformation_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_KONFORMATION.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Konvergenz_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_KONVERGENZ.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Lösung_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_LOESUNG.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Median_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_MEDIAN.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Natur_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_NATUR.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Psychiatrie_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_PSYCHIATRIE.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Quantenteleportation_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_QUANTENTELEPORTATION.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_RNA_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_RNA.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Schildkröte_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_SCHILDKROETE.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Singularität_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_SINGULARITAET.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Spektrum_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_SPEKTRUM.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Stochastik_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_STOCHASTIK.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_T-Rex_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_TYRANNOSAURUS.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Tintenfisch_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_TINTENFISCH.jpg'},
    {thumbnail: '/assets/images/gallery/thumbnails/S2M_Triglyceride_quadFormat.jpg', fullImage: '/assets/images/gallery/fullImages/S2M_TRIGLYCERIDE.jpg'},
  ];

  private get numberOfRows(): number {
    return Number(getComputedStyle(this.hostElement.nativeElement).getPropertyValue('--numberOfRows'));
  }
  private get numberOfColumns(): number {
    return Number(getComputedStyle(this.hostElement.nativeElement).getPropertyValue('--numberOfColumns'));
  }

  constructor(private hostElement: ElementRef) { }

  ngOnInit(): void {
    for (let overallIndex = 0; overallIndex < this.imageURLs.length; ++overallIndex) {
      this.gridArray.push({index: overallIndex, image: this.imageURLs[overallIndex]});
    }
  }

  toggleGrid(event, cell: Cell): void {
    if (this.isAnimating) { return; }
    if (this.isShowingFront) {
      this.showImage(cell);
    } else {
      this.showGrid();
    }
  }

  showGrid(): void {
    this.isAnimating = true;

    const parts = Array.from(document.getElementsByClassName('photo-grid__part'));
    parts.forEach((part) => (part as HTMLElement).classList.add('show-front'));
    this.isAnimating = false;
    this.isShowingFront = true;
  }

  showImage(cell: Cell): void {
    this.isAnimating = true;

    const backParts = Array.from(document.getElementsByClassName('photo-grid__part-back-inner'));
    backParts.forEach((backpart) => (backpart as HTMLElement).style.backgroundImage = `url('${cell.image.fullImage}')`);

    const cellPosition = this.calculatePosition(cell.index);
    console.log(`Cell Position: ${cellPosition.row}, ${cellPosition.column}`);
    this.waveChange(cellPosition.row, cellPosition.column);
    this.isShowingFront = false;
    this.isAnimating = false;
  }

  waveChange(rowN: number, colN: number): void {
    if (rowN > this.numberOfRows || colN > this.numberOfColumns || rowN <= 0 || colN <= 0) { return; }
    const element = this.elementAt(rowN, colN);
    if (!element.classList.contains('show-front')) { return; }
    element.classList.remove('show-front');
    setTimeout(() => {
      this.waveChange(rowN + 1, colN);
      this.waveChange(rowN - 1, colN);
      this.waveChange(rowN, colN + 1);
      this.waveChange(rowN, colN - 1);
    }, this.staggerTime);
  }

  elementAt(rowN: number, colN: number): HTMLElement {
    return document.getElementById('photo-grid__part-' + ((rowN - 1) * this.numberOfColumns + colN - 1));
  }

  calculatePosition(index: number): CellPosition {
    const colIndex = index % this.numberOfColumns;
    const rowIndex = Math.floor(index / this.numberOfColumns);
    return {row: rowIndex + 1, column: colIndex + 1};
  }

}

interface Cell {
  index: number;
  image: GridImage;
}

interface CellPosition {
  row: number;
  column: number;
}

interface GridImage {
  thumbnail: string;
  fullImage: string;
}
