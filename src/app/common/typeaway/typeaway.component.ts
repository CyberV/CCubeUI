import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'typeaway',
  templateUrl: './typeaway.component.html',
  styleUrls: ['./typeaway.component.scss']
})
export class TypeawayComponent implements OnInit {
@Input() text:string;
@Input() skipAnimation:boolean;
@Input() delay:number;
@Output() finished = new EventEmitter();
label:string;

private startInterval:number = 600;
private exitInterval:number= 1000;
private typeInterval:number = 70;

  constructor() {
		this.text = "At this moment, I pledge";
		this.skipAnimation = false;
		this.delay = 0;
  }

  ngOnInit() {
	this.label = "";
	if (this.skipAnimation) {
		this.label = this.text;
		this.finished.emit();
	}
	else {
		setTimeout(()=>{
			this.showNextChar();
		}, this.startInterval);
	}
	
  }
 
  
  showNextChar(){
	  if(this.label.length != this.text.length)
	  {
		this.label = this.text.substring(0,this.label.length + 1);
		setTimeout(()=>{
		this.showNextChar();
	  }, this.label[this.label.length-1] == ',' ? 8 * this.typeInterval : this.typeInterval);
	  }
	  else{
			setTimeout(() => {
				this.finished.emit();
			}, this.delay);

	  }
	  

  
  }

}

