import {Injectable} from '@angular/core';
import {Observable, Observer, ReplaySubject} from 'rxjs';
import {MathContent} from './MathContent';

declare global {
  interface Window {
    hubReady: Observer<boolean>;
  }
}

@Injectable()
export class MathService {

  private readonly notifier: ReplaySubject<boolean>;

  constructor() {
    this.notifier = new ReplaySubject<boolean>();
    window.hubReady = this.notifier;
  }

  ready(): Observable<boolean> {
    return this.notifier;
  }

  render(element: HTMLElement, math?: MathContent): void {
    if (math) {
      if (math.latex) {
        element.innerText = math.latex;
      } else {
        element.innerHTML = math.mathml;
      }
    }
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, element]);
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }
}
