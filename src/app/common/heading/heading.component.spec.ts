import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HeadingComponent } from './heading.component';

describe('HeadingComponent', () => {
  let component: HeadingComponent;
  let fixture: ComponentFixture<HeadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
