import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActasComponent } from './actas/actas.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RazonesSocialesComponent } from './razones-sociales/razones-sociales.component';
import { ObrasComponent } from './obras/obras.component';
import { EspecialidadesComponent } from './especialidades/especialidades.component';
import { CalendarioComponent } from './calendario/calendario.component';



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
  {path: 'calendario', component: CalendarioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
