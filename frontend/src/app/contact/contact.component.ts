import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ReCaptcha2Component} from 'ngx-captcha';
import {EmailService} from '../services/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @ViewChild('captchaElem') captcha: ReCaptcha2Component;
  sendingFailed: boolean;
  sendingSuccessful = false;
  contactForm;
  siteKey: any = '6Le9s28aAAAAAEeWPbrJ_duoHBQoFnReQneLIY7q';
  size: any;
  lang: any;
  theme: any;
  type: any;

  constructor(private httpClient: HttpClient,
              private formBuilder: FormBuilder,
              private emailService: EmailService) {
  }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      contactMail: new FormControl(''),
      content: new FormControl(''),
      recaptcha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.sendingFailed = false;
    this.sendingSuccessful = false;

    const contactMail = 'contactMail';
    const content = 'content';

    let body = '<h4>Kontakt-Mail</h4>' + this.contactForm.get(contactMail).value;
    body += '<h4>Inhalt</h4>';
    body += this.contactForm.get('content').value;

    const eMailForm = {
      content: body,
      subject: 'Ein Benutzer hat Kontakt aufgenommen'
    };

    this.emailService.sendMail(eMailForm).subscribe(
      (res) => {
        if (res === true) {
          this.sendingSuccessful = true;
          this.contactForm.get(contactMail).setValue('');
          this.contactForm.get(content).setValue('');
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
