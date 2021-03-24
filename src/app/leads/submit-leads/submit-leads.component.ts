import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'submit-leads',
  templateUrl: './submit-leads.component.html',
  styleUrls: ['./submit-leads.component.scss'],
})
export class SubmitLeadsComponent implements OnInit {

  public leads:any;
  constructor(private http: HttpClient) {
    this.leads = [];
    this.addEmptyLeads(10);
  }

  submit(aa) {
    console.log(this.leads);
    let url = 'http://localhost:4000/api/lead/createBulk'

    const formData = {
      name: 'testName',
      phone: 'testPhone',
      remarks: 'res'
    };
  
    let data = null;
  
    console.log('hitting URL POST');
    this.http.post(url, this.leads).subscribe((res) => {
    //this.http.post(url, this.leads[0]).subscribe((res) => {
      console.log('REsponse from API', res);
      alert(res['leads'].length + ' Leads Added Succesffuly. Good Job!');
      this.leads = [];
      this.addEmptyLeads(10);
    });
    // request.post({ url: url, formData: formData }, function optionalCallback(err, httpResponse, body) {
    //   if (err) {
    //     return console.error('upload failed:', err);
    //   }

    //   console.log(body);
  
  
    // });

  }

  addEmptyLeads(n=1) {
    for(let i=0;i<=n-1; i++) {
      this.leads.push({
        name: '',
        phone: '',
        remarks: ''
      });
    }
    
  }

  ngOnInit() {}

}
