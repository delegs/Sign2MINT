import { SafeHtmlPipe } from './safe-html.pipe';
import {DomSanitizer} from '@angular/platform-browser';
import {mock} from 'ts-mockito';

describe('SafeHtmlPipe', () => {
  it('create an instance', () => {
    const domSanitizerMock = mock(DomSanitizer);
    const pipe = new SafeHtmlPipe(domSanitizerMock);
    expect(pipe).toBeTruthy();
  });
});
