import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActasComponent } from './actas/actas.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RazonesSocialesComponent } from './razones-sociales/razones-sociales.component';
import { ObrasComponent } from './obras/obras.component';
import { EspecialidadesComponent } from './especialidades/especialidades.component';
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




const routes: Routes = [
  //Aqui agregaremos las rutas de las paginas la sacaremos de nav-data
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  // ejemplo {path: 'settings', component: SettingsComponent} //Recordar cambiar su el nombre de su component: por ejemplo SettingsComponent
  {path: 'actas', component: ActasComponent},
  {path: 'perfiles', component: PerfilesComponent},
  {path: 'razonesSociales', component: RazonesSocialesComponent},
  {path: 'obras', component: ObrasComponent},
  {path: 'especialidades', component: EspecialidadesComponent},
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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
