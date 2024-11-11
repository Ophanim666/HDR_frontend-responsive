import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActasComponent } from './actas/actas.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { ObrasComponent } from './obras/obras.component';
import { GestionTareaComponent } from './gestion-tarea/gestion-tarea.component';
import { GestionEspecialidadComponent } from './gestion-especialidad/gestion-especialidad.component';
// Componente creación de usuarios
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { EdicionDeUsuariosComponent } from './edicion-de-usuarios/edicion-de-usuarios.component';
// Gestión proveedores
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';
// componente gestion tipo de parametro Alvaro
import { GestionTipoParametrosComponent } from './gestion-tipo-parametros/gestion-tipo-parametros.component';
// Gestión parametros
import { ParametrosComponent } from './parametros/parametros.component';
// Login
import { LogInComponent } from './log-in/log-in.component';

const routes: Routes = [
  // Aqui están las rutas de las páginas
  {path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a la ruta de login por defecto
  {path: 'dashboard', component: DashboardComponent},
  // Ejemplo {path: 'settings', component: SettingsComponent} // Recordar cambiar el nombre de su component, por ejemplo: SettingsComponent
  {path: 'actas', component: ActasComponent},
  {path: 'perfiles', component: PerfilesComponent},
  {path: 'obras', component: ObrasComponent},
  {path: 'gestion-tarea', component: GestionTareaComponent},
  // Creación de usuarios
  { path: 'crear-usuario', component: CrearUsuariosComponent },
  // Edición de usuarios
  { path: 'edicion-de-usuarios', component: EdicionDeUsuariosComponent },
  // Gestión de proveedores
  { path: 'gestion-proveedores', component: GestionProveedoresComponent },
  // Gestión de especialidad
  { path: 'gestion-especialidad', component: GestionEspecialidadComponent },
  // Gestion tipo de parámetro
  { path: 'gestion-tipo-parametros', component: GestionTipoParametrosComponent },
  // Gestión parámetros
  { path: 'parametros', component: ParametrosComponent },
  // LogIn debe ser la primera página que se ejecuta
  { path: 'login', component: LogInComponent }, // Ruta para el componente de inicio de sesión
  { path: '**', redirectTo: '/login' } // Redirige rutas no encontradas a login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
