import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BeaconScanPage } from './beacon-scan.page';

describe('BeaconScanPage', () => {
  let component: BeaconScanPage;
  let fixture: ComponentFixture<BeaconScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeaconScanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BeaconScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
