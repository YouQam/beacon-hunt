import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GameSettingsPage } from './game-settings.page';

describe('GameSettingsPage', () => {
  let component: GameSettingsPage;
  let fixture: ComponentFixture<GameSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameSettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GameSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
