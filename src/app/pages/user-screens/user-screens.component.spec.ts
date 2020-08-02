import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserScreensComponent } from './user-screens.component';

describe('UserScreensComponent', () => {
  let component: UserScreensComponent;
  let fixture: ComponentFixture<UserScreensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserScreensComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
