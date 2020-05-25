import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CtaComponent } from './cta.component';

describe('CtaComponent', () => {
  let component: CtaComponent;
  let fixture: ComponentFixture<CtaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
