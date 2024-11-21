import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';  // Asegúrate de importar Router
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { navbarData } from './nav-data';  // Asegúrate de que la ruta sea correcta

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    trigger('rotate', [
      transition(':enter', animate('1000ms', keyframes([
        style({ transform: 'rotate(0deg)', offset: '0' }),
        style({ transform: 'rotate(2turn)', offset: '1' })
      ])))
    ])
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  showLogoutModal = false;  // Control para mostrar el modal de logout

  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
      // Inicializa el sidenav abierto al cargar la página
    this.collapsed = true; // Cambia a "true" para que el sidenav esté abierto inicialmente.

  // Emitimos el estado inicial del sidenav (opcional, en caso de que otros componentes lo necesiten)
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });

  }

  
  toggleColapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  // Abrir el modal de confirmación de logout
  openLogoutModal() {
    this.showLogoutModal = true;
  }

  // Cancelar el logout y cerrar el modal
  cancelLogout() {
    this.showLogoutModal = false;
  }

  // Confirmar el logout
  confirmLogout() {
    localStorage.removeItem('token');  // Elimina el token de autenticación
    this.router.navigate(['/login']);  // Redirige al login
    this.showLogoutModal = false;  // Cierra el modal
  }
}
