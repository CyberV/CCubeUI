import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var $;
@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

  @Input() length: number;
  @Input() value: number;

  @Input() stepCount: number;
  @Input() interval: number;

  @Output() valueChange = new EventEmitter();

  mock: any;
  ready: boolean;
  intervalKey: any;

  offset: number;

  constructor() {
    this.length = 7;
    this.value = 100000;

    this.stepCount = 1;
    this.interval =  3 * 1000;
    this.ready = false;
    this.offset = 0;
  }

  ngOnInit() {
    let dt:any = localStorage.getItem('commonData');
    let upd = localStorage.getItem('updatedWaterCount');

    if (dt && dt != "null") {
      dt = JSON.parse(dt);
      if (dt.waterSaved && dt.waterSaved > 100000) {
        this.value =  ((upd && upd != 'null') ? +(upd) :  dt.waterSaved);
      }
    }
    this.mock = [];
    let values = [];
    let str = this.value.toString();
    for (let i = 0; i < this.length; i++) {
      this.mock.push(i);
    }

    for (let i = 0; i < str.length; i++) {
      values.push(+(str.substr(i, 1)));
    }

    
    this.ready = true;



    setTimeout(() => {
      this.setInitialValues(values);
      this.begin();
    }, 10);

  }

  begin() {
    this.offset = 0;
    this.intervalKey = setInterval(() => {
      this.increment(this.length - 1);
    }, this.interval);
  }

  ngOnDestroy() {
    clearInterval(this.intervalKey);
  }

  setInitialValues(values) {

    if (values.length < this.length) {
      let diff = this.length - values.length;

      for (let i=0;i<diff;i++) {
        values.unshift(0);
      }
    }

    for (let i = 0; i < values.length; i++) {
      let className = 'counter-' + i;

      if (values[i] == 0) {
        let first = $("ul." + className + " li").eq(0);
        first.addClass("active");
      }

      if (values[i] > 0) {
      let first = $("ul." + className + " li").eq(0);
      first.addClass("before");
      let aa = $("ul." + className + " li").eq(+(values[i]));
      aa.addClass("active")
        .closest(".counter-container")
        .addClass("play");
      } 
    }

  }


  increment(index) {
    if (this.value) {
      this.value++;

      localStorage.setItem('updatedWaterCount', this.value.toString());
    }
     if (index < 0 ) {
      return;
    }
    $(".counter-container").removeClass("play");
    var aa = $("ul.counter-" + index + " li.active");

    if (aa.html() == undefined) {
      aa = $("ul.counter-" + index + " li").eq(0);
      aa.addClass("before")
        .removeClass("active")
        .next("li")
        .addClass("active")
        .closest(".counter-container")
        .addClass("play");

    }
    else if (aa.is(":last-child")) {
      $("ul.counter-" + index + " li").removeClass("before");
      aa.addClass("before").removeClass("active");
      aa = $("ul.counter-" + index + " li").eq(0);
      aa.addClass("active")
        .closest(".counter-container")
        .addClass("play");

      this.increment(index - 1)
    }
    else {
      $("ul.counter-" + index + " li").removeClass("before");
      aa.addClass("before")
        .removeClass("active")
        .next("li")
        .addClass("active")
        .closest(".counter-container")
        .addClass("play");
    }

  }

}
