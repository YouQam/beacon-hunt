import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateTaskMenuPage } from './create-task-menu.page';

describe('CreateTaskMenuPage', () => {
  let component: CreateTaskMenuPage;
  let fixture: ComponentFixture<CreateTaskMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTaskMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTaskMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
