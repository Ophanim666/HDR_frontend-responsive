import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActasComponent } from './actas/actas.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { ObrasComponent } from './obras/obras.component';
import { GestionTareaComponent } from './gestion-tarea/gestion-tarea.component';
import { GestionEspecialidadComponent } from './gestion-especialidad/gestion-especialidad.component';
// componente crear usuario
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { EdicionDeUsuariosComponent } from './edicion-de-usuarios/edicion-de-usuarios.component';
// Gestion proveedores
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';
//componente gestion tipo de parametro Alvaro
import { GestionTipoParametrosComponent } from './gestion-tipo-parametros/gestion-tipo-parametros.component';
//Gestión parametros
import { ParametrosComponent } from './parametros/parametros.component';
//Login
import { LogInComponent } from './log-in/log-in.component';




const routes: Routes = [
  //Aqui agregaremos las rutas de las paginas la sacaremos de nav-data
  {path: 'dashboard', component: DashboardComponent},
  // ejemplo {path: 'settings', component: SettingsComponent} //Recordar cambiar su el nombre de su component: por ejemplo SettingsComponent
  {path: 'actas', component: ActasComponent},
  {path: 'perfiles', component: PerfilesComponent},
  {path: 'obras', component: ObrasComponent},
  {path: 'gestion-tarea', component: GestionTareaComponent},
  // crear usuario
  { path: 'crear-usuario', component: CrearUsuariosComponent },
  //Edicion de usuarios
  { path: 'edicion-de-usuarios', component: EdicionDeUsuariosComponent },
  //Gestion de Proveedores
  { path: 'gestion-proveedores', component: GestionProveedoresComponent },
  //Gestión de especialidad
  { path: 'gestion-especialidad', component: GestionEspecialidadComponent },
  //Gestion tipo de parametro ALVARO
  { path: 'gestion-tipo-parametros', component: GestionTipoParametrosComponent },
  //Gestión parámetros
  { path: 'parametros', component: ParametrosComponent },
  //LogIn ahora es la pagina que primero se ejecuta
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a la ruta de login por defecto
  { path: 'login', component: LogInComponent }, // Ruta para el componente de inicio de sesión
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
