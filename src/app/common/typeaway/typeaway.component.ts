import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'typeaway',
  templateUrl: './typeaway.component.html',
  styleUrls: ['./typeaway.component.scss']
})
export class TypeawayComponent implements OnInit {
@Input() text:string;
@Output() finished = new EventEmitter();
label:string;

private startInterval:number = 600;
private exitInterval:number= 1000;
private typeInterval:number = 70;

  constructor() {
  	this.text = "At this moment, I pledge";
  }

  ngOnInit() {
	this.label = "";
	
	setTimeout(()=>{
		this.showNextChar();
	}, this.startInterval);
	
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
		this.finished.emit();
	  }
	  

  
  }

}

