import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'HRD_BI_FrontEnd_Responsive';
  isSideNavCollapsed = false;
  screenWidth = 0;
  showSidenav = true;

  constructor(private router: Router) {
    // Verificar la ruta inicial
    this.showSidenav = !this.router.url.includes('/login');
  }

  ngOnInit(): void {
    // Suscribirse a los cambios de ruta
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Ahora TypeScript sabe que event es de tipo NavigationEnd
      this.showSidenav = !event.urlAfterRedirects.includes('/login');
      
      // Si estamos en login, asegurarse de que el contenido ocupe todo el ancho
      if (event.urlAfterRedirects.includes('/login')) {
        this.isSideNavCollapsed = false;
        this.screenWidth = window.innerWidth;
      }
    });
  }

  onToggleSideNav(data: SideNavToggle): void {
    if (this.showSidenav) {
      this.screenWidth = data.screenWidth;
      this.isSideNavCollapsed = data.collapsed;
    }
  }
}