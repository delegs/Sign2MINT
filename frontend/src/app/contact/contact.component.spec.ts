import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactComponent} from './contact.component';
import {HttpClient} from '@angular/common/http';
import {instance, mock} from 'ts-mockito';
import {FormBuilder} from '@angular/forms';
import {LexiconEntryService} from '../services/lexicon-entry.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  const httpClientMock = mock(HttpClient);
  const lexiconEntryServiceMock = mock(LexiconEntryService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: instance(httpClientMock)},
        FormBuilder,
        {provide: LexiconEntryService, useValue: instance(lexiconEntryServiceMock)}
      ],
      declarations: [ContactComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
