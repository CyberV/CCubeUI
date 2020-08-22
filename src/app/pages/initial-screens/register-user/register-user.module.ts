import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from './register-user.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderModule } from 'app/components/header/header.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [RegisterUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    RouterModule.forChild([
      {
        path: '',
        component: RegisterUserComponent
      }
    ])
  ]
})
export class RegisterUserModule { }
