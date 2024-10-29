import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';  // Importamos Router y NavigationEnd
import { filter } from 'rxjs/operators';  // Importamos filter para filtrar eventos de navegación

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Corregí "styleUrl" por "styleUrls"
})
export class AppComponent implements OnInit {
  title = 'HRD_BI_FrontEnd_Responsive';

  isSideNavCollapsed = false;
  screenWidth = 0;
  showSidenav = true;  // Nueva propiedad para controlar la visualización del sidenav

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Nos suscribimos a los eventos del Router para detectar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))  // Filtramos solo los eventos de tipo NavigationEnd
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {  // Verificamos el tipo del evento
          // Si la ruta es /login, ocultamos el sidenav
          this.showSidenav = event.url !== '/login';
        }
      });
  }

  // Funcionalidad para colapsar o expandir el sidenav
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
