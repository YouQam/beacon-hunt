import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoredBeaconListPage } from './stored-beacon-list.page';

describe('StoredBeaconListPage', () => {
  let component: StoredBeaconListPage;
  let fixture: ComponentFixture<StoredBeaconListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredBeaconListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoredBeaconListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
