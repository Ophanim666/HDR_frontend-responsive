import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//agregaremos animaciones wajajajaja
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { CalendarioComponent } from './calendario/calendario.component';

//HTTPclient
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';




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
    CalendarioComponent,
    FooterComponent,
    HeaderComponent
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
    //animations
    BrowserAnimationsModule,
    AppRoutingModule,
    //HTTPclient
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }