import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateGameListPage } from './update-game-list.page';

describe('UpdateGameListPage', () => {
  let component: UpdateGameListPage;
  let fixture: ComponentFixture<UpdateGameListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateGameListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateGameListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
