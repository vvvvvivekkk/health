import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './components/dashboard/doctor-dashboard.component';
import { StudentDashboardComponent } from './components/dashboard/student-dashboard.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { RecordsComponent } from './components/records/records.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { StudentsComponent } from './components/students/students.component';

// Guards
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  { path: 'doctor/dashboard', component: DoctorDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'doctor' } },
  { path: 'student/dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'records', component: RecordsComponent, canActivate: [AuthGuard] },
  { path: 'doctors', component: DoctorsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRoles: ['admin', 'doctor'] } },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }