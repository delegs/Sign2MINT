import {Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {MathService} from './math.service';
import {take, takeUntil} from 'rxjs/operators';
import {MathContent} from './MathContent';

@Directive({
  selector: '[appMath]'
})
export class MathDirective implements OnInit, OnChanges, OnDestroy {
  private alive$ = new Subject<boolean>();

  @Input()
  private appMath: MathContent;
  private readonly htmlElement: HTMLElement;

  constructor(private service: MathService, private el: ElementRef) {
    this.htmlElement = el.nativeElement as HTMLElement;
  }

  ngOnInit(): void {
    this.service
      .ready()
      .pipe(
        take(1),
        takeUntil(this.alive$)
      ).subscribe(() => {
      this.service.render(this.htmlElement, this.appMath);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    this.alive$.next(false);
  }
}
