import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';

// Rutas y HttpClient
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActasComponent } from './actas/actas.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { ObrasComponent } from './obras/obras.component';
import { GestionTareaComponent } from './gestion-tarea/gestion-tarea.component';
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { EdicionDeUsuariosComponent } from './edicion-de-usuarios/edicion-de-usuarios.component';
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';
import { GestionEspecialidadComponent } from './gestion-especialidad/gestion-especialidad.component';
import { HeaderComponent } from './header/header.component';
import { GestionTipoParametrosComponent } from './gestion-tipo-parametros/gestion-tipo-parametros.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { CrearParametroComponent } from './crear-parametro/crear-parametro.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    ActasComponent,
    PerfilesComponent,
    ObrasComponent,
    CrearUsuariosComponent,
    EdicionDeUsuariosComponent,
    GestionTareaComponent,
    GestionProveedoresComponent,
    GestionEspecialidadComponent,
    HeaderComponent,
    GestionTipoParametrosComponent,
    ParametrosComponent,
    CrearParametroComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
  ],

  providers: [],

  bootstrap: [AppComponent]
})

export class AppModule {}
