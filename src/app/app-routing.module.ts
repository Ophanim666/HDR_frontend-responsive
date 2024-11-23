import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActasComponent } from './actas/actas.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { ObrasComponent } from './obras/obras.component';
import { GestionTareaComponent } from './gestion-tarea/gestion-tarea.component';
import { GestionEspecialidadComponent } from './gestion-especialidad/gestion-especialidad.component';
// Gestión proveedores
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';
// componente gestion tipo de parametro Alvaro
import { GestionTipoParametrosComponent } from './gestion-tipo-parametros/gestion-tipo-parametros.component';
// Gestión parametros
import { ParametrosComponent } from './parametros/parametros.component';
// Login
import { LogInComponent } from './log-in/log-in.component';
// Protección de rutas
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Aqui están las rutas de las páginas
  {path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a la ruta de login por defecto
  // Ejemplo {path: 'settings', component: SettingsComponent} // Recordar cambiar el nombre de su component, por ejemplo: SettingsComponent
  {path: 'actas', component: ActasComponent, canActivate: [AuthGuard]},
  {path: 'perfiles', component: PerfilesComponent, canActivate: [AuthGuard]},
  {path: 'obras', component: ObrasComponent, canActivate: [AuthGuard]},
  {path: 'gestion-tarea', component: GestionTareaComponent, canActivate: [AuthGuard]},
  // Gestión de proveedores
  { path: 'gestion-proveedores', component: GestionProveedoresComponent, canActivate: [AuthGuard] },
  // Gestión de especialidad
  { path: 'gestion-especialidad', component: GestionEspecialidadComponent, canActivate: [AuthGuard] },
  // Gestion tipo de parámetro
  { path: 'gestion-tipo-parametros', component: GestionTipoParametrosComponent, canActivate: [AuthGuard] },
  // Gestión parámetros
  { path: 'parametros', component: ParametrosComponent, canActivate: [AuthGuard] },
  // LogIn debe ser la primera página que se ejecuta
  { path: 'login', component: LogInComponent }, // Ruta para el componente de inicio de sesión
  { path: '**', redirectTo: '/login' } // Redirige rutas no encontradas a login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
