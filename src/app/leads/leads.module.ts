import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsPage } from './leads/leads.page';
import { SubmitLeadsComponent } from './submit-leads/submit-leads.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonComponentsModule } from 'app/common/common.module';
import { LeadsPageRoutingModule } from './leads-routing.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [LeadsPage, SubmitLeadsComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule,
    LeadsPageRoutingModule,
    CommonComponentsModule
  ],
  bootstrap: [LeadsPage]
})
export class LeadsModule { }
