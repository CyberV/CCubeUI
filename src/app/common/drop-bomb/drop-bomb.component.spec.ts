/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DropBombComponent } from './drop-bomb.component';

describe('DropBombComponent', () => {
  let component: DropBombComponent;
  let fixture: ComponentFixture<DropBombComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropBombComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropBombComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
