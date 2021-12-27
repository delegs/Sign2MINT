import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ReCaptcha2Component} from 'ngx-captcha';
import {EmailService} from '../services/email.service';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnInit {
  @ViewChild('captchaElem') captcha: ReCaptcha2Component;
  sendingFailed: boolean;
  sendingSuccessful = false;
  suggestionForm;
  siteKey: any = '6Le9s28aAAAAAEeWPbrJ_duoHBQoFnReQneLIY7q';
  size: any  = 'normal';
  lang: any;
  theme: any;
  type: any;

  constructor(private httpClient: HttpClient,
              private formBuilder: FormBuilder,
              private emailService: EmailService) {
  }

  ngOnInit(): void {
    this.suggestionForm = this.formBuilder.group({
      fachbegriff: '',
      fachbereich: '',
      recaptcha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.sendingFailed = false;
    this.sendingSuccessful = false;

    const fachbegriff = 'fachbegriff';
    const fachbereich = 'fachbereich';

    const suggestionContent = {
      subject: 'Vorschlag: ' + this.suggestionForm.get(fachbegriff).value + ' - ' + this.suggestionForm.get(fachbereich).value,
      content: ''
    };

    this.emailService.sendMail(suggestionContent).subscribe(
      (res) => {
        if (res === true) {
          this.sendingSuccessful = true;
          this.suggestionForm.get(fachbegriff).setValue('');
          this.suggestionForm.get(fachbereich).setValue('');
          this.captcha.resetCaptcha();
        } else if (res === false) {
          this.sendingFailed = true;
        }
      }
      ,
      () => {
        this.sendingFailed = true;
      }
    );
  }

  onInputChanged(): void {
    if (this.sendingSuccessful) {
      this.sendingSuccessful = false;
    }
    if (this.sendingFailed) {
      this.sendingSuccessful = false;
    }
  }
}
