import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapAddLocPage } from './map-add-loc.page';

describe('MapAddLocPage', () => {
  let component: MapAddLocPage;
  let fixture: ComponentFixture<MapAddLocPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAddLocPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapAddLocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
