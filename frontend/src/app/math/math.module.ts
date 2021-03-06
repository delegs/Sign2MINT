import {ModuleWithProviders, NgModule} from '@angular/core';
import {MathDirective} from './math.directive';
import {MathService} from './math.service';

@NgModule({
  declarations: [MathDirective],
  exports: [MathDirective]
})
export class MathModule {

  constructor() {
    const script = document.createElement('script') as HTMLScriptElement;
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML';
    script.async = true;

    document.getElementsByTagName('head')[0].appendChild(script);

    const config = document.createElement('script') as HTMLScriptElement;
    config.type = 'text/x-mathjax-config';
    config.text = `
    MathJax.Hub.Config({
        skipStartupTypeset: true,
        tex2jax: { inlineMath: [["$", "$"]],displayMath:[["$$", "$$"]] },
        menuSettings: { inTabOrder: false }
      });
      MathJax.Hub.Register.StartupHook('End', () => {
        window.hubReady.next(true);
        window.hubReady.complete();
      });
    `;

    document.getElementsByTagName('head')[0].appendChild(config);
  }

  public static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: MathModule,
      providers: [{provide: MathService, useClass: MathService}]
    };
  }
}
