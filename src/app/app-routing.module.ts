import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlanComparisonComponent } from './plan-comparison/plan-comparison.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterUserComponent } from './pages/initial-screens/register-user/register-user.component';
import { ReferEarnComponent } from './common/refer-earn/refer-earn.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FaqComponent } from './pages/faq/faq.component';

const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () => import ('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'leads',
    loadChildren: () => import ('./leads/leads.module').then(m => m.LeadsModule)
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'plans',
  component: PlanComparisonComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'refer',
    component: ProfileComponent
  },
  {
    // N6 – standalone ContactComponent replaces the legacy ProfileComponent
    // context-switch. Deep links to /contact keep working without change.
    path: 'contact',
    component: ContactComponent
  },
  {
    // N6 – brand new FAQ route.
    path: 'faq',
    component: FaqComponent
  },
  {
  path: 'about',
    component: ProfileComponent
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
