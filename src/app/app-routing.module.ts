import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlanComparisonComponent } from './plan-comparison/plan-comparison.component';
import { RegisterUserComponent } from './pages/initial-screens/register-user/register-user.component';

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
    path: 'pages',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
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
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  }, {
    path: 'register',
    component: RegisterUserComponent
  },{
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
