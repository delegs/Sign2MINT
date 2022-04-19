import {Component} from '@angular/core';

import SwiperCore, {A11y, Navigation, Pagination, Scrollbar, } from 'swiper/core';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


@Component({
  selector: 'app-swiper-video-metadata',
  templateUrl: './swiper-video-metadata.component.html',
  styleUrls: ['./swiper-video-metadata.component.scss']
})
export class SwiperVideoMetadataComponent {

  constructor() {
  }
}
