import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {FaConfig} from '@fortawesome/angular-fontawesome';
import {instance, mock} from 'ts-mockito';
import {DeviceService} from './services/device.service';

describe('AppComponent', () => {
  const faConfigMock = mock(FaConfig);
  const deviceService = mock(DeviceService);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: FaConfig, useValue: instance(faConfigMock)},
        {provide: DeviceService, useValue: instance(deviceService)}
      ],
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'sign2mint-website'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('sign2mint-website');
  });

});
