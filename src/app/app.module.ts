import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//agregaremos animaciones wajajajaja
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//necesaria para editar parametros ALVARO
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';

//para crear modal dialogs
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


//eliminar esto solo es de ejmplo
// import { ProductsComponent } from './products/products.component';
// import { StatisticsComponent } from './statistics/statistics.component';
// import { CoupnesComponent } from './coupnes/coupnes.component';
// import { PagesComponent } from './pages/pages.component';
// import { MediaComponent } from './media/media.component';
// import { SettingsComponent } from './settings/settings.component';
//
import { ActasComponent } from './actas/actas.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RazonesSocialesComponent } from './razones-sociales/razones-sociales.component';
import { ObrasComponent } from './obras/obras.component';
import { EspecialidadesComponent } from './especialidades/especialidades.component';

//HTTPclient
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
//crear usuarios
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
//editar usuarios
import { EdicionDeUsuariosComponent } from './edicion-de-usuarios/edicion-de-usuarios.component';
//rama que esta trbajando alvaro para el crud tipo de parametro
import { GestionTipoParametrosComponent } from './gestion-tipo-parametros/gestion-tipo-parametros.component';
import { EditarTipoParametroComponent } from './editar-tipo-parametro/editar-tipo-parametro.component';
import { CrearTipoParametroComponent } from './crear-tipo-parametro/crear-tipo-parametro.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { CrearParametroComponent } from './crear-parametro/crear-parametro.component';



@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    //estas se usaran pero no estan definidas al 100%
    ActasComponent,
    PerfilesComponent,
    RazonesSocialesComponent,
    ObrasComponent,
    EspecialidadesComponent,
    FooterComponent,
    CrearUsuariosComponent,
    EdicionDeUsuariosComponent,
    //gestion de tipo parametro - Alvaro
    GestionTipoParametrosComponent,
    EditarTipoParametroComponent,
    CrearTipoParametroComponent,
    ParametrosComponent,
    CrearParametroComponent,

    //Eliminar esto solo es de ejemplo
    // ProductsComponent,
    // StatisticsComponent,
    // CoupnesComponent,
    // PagesComponent,
    // MediaComponent,
    // SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // Asegúrate de que FormsModule está importado aquí
    //animations
    BrowserAnimationsModule,
    AppRoutingModule,
    //HTTPclient
    HttpClientModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
