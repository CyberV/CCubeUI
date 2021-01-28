import { Component, OnInit } from '@angular/core';
declare var $;
@Component({
  selector: 'ads-list',
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss'],
})
export class AdsListComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    $(".carousel").on("touchstart", function(event){
      var xClick = event.originalEvent.touches[0].pageX;
      $(this).one("touchmove", function(event){
          var xMove = event.originalEvent.touches[0].pageX;
          if( Math.floor(xClick - xMove) > 5 ){
              $('.carousel').carousel('next');
          }
          else if( Math.floor(xClick - xMove) < -5 ){
              $('.carousel').carousel('prev');
          }
      });
      $(".carousel").on("touchend", function(){
              $(this).off("touchmove");
      });
    });
  }

}
