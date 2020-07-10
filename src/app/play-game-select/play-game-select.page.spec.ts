import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayGameSelectPage } from './play-game-select.page';

describe('PlayGameSelectPage', () => {
  let component: PlayGameSelectPage;
  let fixture: ComponentFixture<PlayGameSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayGameSelectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayGameSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
