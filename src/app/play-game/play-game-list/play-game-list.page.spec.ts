import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayGameListPage } from './play-game-list.page';

describe('PlayGameListPage', () => {
  let component: PlayGameListPage;
  let fixture: ComponentFixture<PlayGameListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayGameListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayGameListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
