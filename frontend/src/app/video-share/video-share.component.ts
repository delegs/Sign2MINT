import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-video-share',
  templateUrl: './video-share.component.html',
  styleUrls: ['./video-share.component.css']
})
export class VideoShareComponent implements OnInit {

  constructor(private route: ActivatedRoute) {  }

  videoFile: string;

  ngOnInit(): void {

    this.videoFile = environment.videoSupplierUrl + this.route.snapshot.paramMap.get('videoFile');

  }

}
