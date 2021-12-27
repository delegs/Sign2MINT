import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionComponent } from './suggestion.component';
import {HttpClient} from '@angular/common/http';
import {instance, mock} from 'ts-mockito';
import {FormBuilder} from '@angular/forms';
import {LexiconEntryService} from '../services/lexicon-entry.service';

describe('SuggestionComponent', () => {
  let component: SuggestionComponent;
  let fixture: ComponentFixture<SuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestionComponent ],
      providers: [
        {provide: HttpClient, useValue: instance(mock(HttpClient))},
        {provide: FormBuilder, useValue: new FormBuilder()},
        {provide: LexiconEntryService, useValue: instance(mock(LexiconEntryService))},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
