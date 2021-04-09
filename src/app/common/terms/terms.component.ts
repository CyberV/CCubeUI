import { Component, OnInit } from '@angular/core';
import { getConfigValue } from '../common.service';

@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {

  privacyConfig:any;
  constructor() {
    this.privacyConfig = getConfigValue('PRIVACY_CONFIG');
  }

  ngOnInit() {
   
  }

}
