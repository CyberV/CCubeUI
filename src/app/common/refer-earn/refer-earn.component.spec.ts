import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReferEarnComponent } from './refer-earn.component';

describe('ReferEarnComponent', () => {
  let component: ReferEarnComponent;
  let fixture: ComponentFixture<ReferEarnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferEarnComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReferEarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
