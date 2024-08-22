import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Animaciones
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Crear modal dialogs
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ActasComponent } from './actas/actas.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RazonesSocialesComponent } from './razones-sociales/razones-sociales.component';
import { ObrasComponent } from './obras/obras.component';
import { EspecialidadesComponent } from './especialidades/especialidades.component';
import { GestionTareaComponent } from './gestion-tarea/gestion-tarea.component';

// HTTPclient
import { HttpClientModule } from '@angular/common/http';

// Crear usuarios
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';

// Editar usuarios
import { EdicionDeUsuariosComponent } from './edicion-de-usuarios/edicion-de-usuarios.component';

// Gestión de proveedores
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';
import { GestionEspecialidadComponent } from './gestion-especialidad/gestion-especialidad.component';
import { HeaderComponent } from './header/header.component';

// Rama que está trbajando Álvaro para el CRUD tipo de parámetro
import { GestionTipoParametrosComponent } from './gestion-tipo-parametros/gestion-tipo-parametros.component';

import { ParametrosComponent } from './parametros/parametros.component';
import { CrearParametroComponent } from './crear-parametro/crear-parametro.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,

    // Estas se usarán pero no están definidas al 100%
    ActasComponent,
    PerfilesComponent,
    RazonesSocialesComponent,
    ObrasComponent,
    EspecialidadesComponent,
    CrearUsuariosComponent,
    EdicionDeUsuariosComponent,
    GestionTareaComponent,
    GestionProveedoresComponent,
    GestionEspecialidadComponent,
    HeaderComponent,

    // Gestión de tipo parámetro - Álvaro
    GestionTipoParametrosComponent,
    ParametrosComponent,
    CrearParametroComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,

    // Animaciones
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

export class AppModule {}
