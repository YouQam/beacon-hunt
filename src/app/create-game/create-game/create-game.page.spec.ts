import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateGamePage } from './create-game.page';

describe('CreateGamePage', () => {
  let component: CreateGamePage;
  let fixture: ComponentFixture<CreateGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
