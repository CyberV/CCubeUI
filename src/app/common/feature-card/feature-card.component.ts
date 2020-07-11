import { Component, OnInit, Input, ViewChildren, ElementRef, QueryList} from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'feature-card', 
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.scss'],
})
export class FeatureCardComponent implements OnInit {

  @Input() direction:string;
  @Input() title:string;
  @Input() points: any;
  @Input() icon: string;
  @Input() solution: string;

  useIcon:boolean;

  @ViewChildren('infoContainer') infoContainer : QueryList<ElementRef>;

  constructor(private platform:Platform) {
    this.direction = 'left';
    this.title = 'titless';
    this.points = [];
    this.icon="";
    this.points.push('Point 1');
    this.points.push('Point 2');
    this.solution = 'The solution';

    this.useIcon = false;
   }

   get isMobile() {
    return !this.platform.is('desktop');
  }
  ngOnInit() {
    // console.log('container height ', this.infoContainer.first.nativeElement.offsetHeight);
    // console.log('row height ', this.infoContainer.first.nativeElement.children[0].offsetHeight);
    if (this.icon.length>0) {
      this.useIcon = true;
    }
  }

  ngAfterViewInit() {
    console.log('container height ', this.infoContainer.first.nativeElement.offsetHeight);
    console.log('row height ', this.infoContainer.first.nativeElement.children[0].offsetHeight);

  }

}
