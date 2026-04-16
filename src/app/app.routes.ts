import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeListComponent } from './pages/employee/list/list.component';
import { EmployeeCreateComponent } from './pages/employee/create/create.component';
import { PorjectListComponent } from './pages/project/list/list.component';
import { ProjectCreateComponent } from './pages/project/create/create.component';
import { TaskListComponent } from './pages/task/list/list.component';
import { TaskCreateComponent } from './pages/task/create/create.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BookComponent } from './pages/cashbook/book/book.component';
import { CashComponent } from './pages/cashbook/cash/cash.component';
import { InvoiceListComponent } from './pages/invoice/list/invoice.component';
import { InvoiceCreateComponent } from './pages/invoice/create/create.component';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      // { path: '', component: DashboardComponent },
      // Dashboard
      { path: 'dashboard', component: DashboardComponent },
      // Employee
      { path: 'employee-list', component: EmployeeListComponent },
      { path: 'employee-add', component: EmployeeCreateComponent },
      { path: 'employee-edit/:id', component: EmployeeCreateComponent },
      // Project
      { path: 'project-list', component: PorjectListComponent },
      { path: 'project-add', component: ProjectCreateComponent },
      { path: 'project-edit/:id', component: ProjectCreateComponent },
      // Task
      { path: 'task-list', component: TaskListComponent },
      { path: 'task-add', component: TaskCreateComponent },
      { path: 'task-edit/:id', component: TaskCreateComponent },
      // Finance
      { path: 'finance-book-list', component: BookComponent },
      { path: 'finance-cash-list', component: CashComponent },
      { path: 'finance-invoice-list', component: InvoiceListComponent },
      { path: 'finance-invoice-add', component: InvoiceCreateComponent },
      // Profile
      { path: 'settings-profile', component: ProfileComponent },
    ],
  },
];
