import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

//pagination
import { MatPaginatorModule } from '@angular/material/paginator';

// Animaciones
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Importa MatNativeDateModule para el adaptador de fechas nativo
// Importa otros módulos necesarios de Angular Material

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Usar botones de Angular
import { MatButtonModule } from '@angular/material/button';
// Crear modal dialogs
import { MatDialogModule } from '@angular/material/dialog';
// Usar inputs Angular
import {MatInputModule} from '@angular/material/input';
// Forms Angular
import {MatFormFieldModule} from '@angular/material/form-field';
// Switch ANGULAR
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
// Select simple
import {MatSelectModule} from '@angular/material/select';

// Esto es para el formulario del proveedores ya que es el que tiene mas inputs
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

// Para los items de especialidad
import { MatOptionModule } from '@angular/material/core'; // Este módulo contiene mat-option


import { ActasComponent } from './actas/actas.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { ObrasComponent } from './obras/obras.component';
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
    ObrasComponent,
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

    //paginacion
    MatPaginatorModule,

    // Animaciones
    BrowserAnimationsModule,
    AppRoutingModule,
    
    MatSelectModule,
    
    //HTTPclient
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule, // Agrega este módulo
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
  ],

  providers: [
    provideAnimationsAsync()
  ],

  bootstrap: [AppComponent]
})

export class AppModule {}
