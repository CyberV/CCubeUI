/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TypeawayComponent } from './typeaway.component';

describe('TypeawayComponent', () => {
  let component: TypeawayComponent;
  let fixture: ComponentFixture<TypeawayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeawayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeawayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
