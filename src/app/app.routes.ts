import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeListComponent } from './pages/employee/list/list.component';
import { EmployeeCreateComponent } from './pages/employee/create/create.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employee-list', component: EmployeeListComponent },
      { path: 'employee-add', component: EmployeeCreateComponent },
      { path: 'employee-edit/:id', component: EmployeeCreateComponent },
    ],
  },
];
