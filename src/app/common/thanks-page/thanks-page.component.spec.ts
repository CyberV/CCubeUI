import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThanksPageComponent } from './thanks-page.component';

describe('ThanksPageComponent', () => {
  let component: ThanksPageComponent;
  let fixture: ComponentFixture<ThanksPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThanksPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThanksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
