import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'drop-bomb',
  templateUrl: './drop-bomb.component.html',
  styleUrls: ['./drop-bomb.component.scss']
})
export class DropBombComponent implements OnInit {

	@Input() text:string;
	@Output() finished = new EventEmitter();

	private startInterval:number = 2000;
	private exitInterval:number= 1000;
	private dropInterval:number = 1500;

	label:string;

  	constructor() { }

    ngOnInit() {
		this.label = "";
		
		setTimeout(()=>{
			this.dropNextWord();
		}, this.startInterval);
		
  	}
 
  
  dropNextWord(){
  	let src =  this.text.split(' ');
	let dst = this.label.split(' ');
		
	  if(this.label != this.text)
	  {
	  	this.label = this.text;
		setTimeout(()=>{
		this.dropNextWord();
	  }, this.dropInterval);
	  }
	  else{
		this.finished.emit();
	  }
	  

  
  }
}
