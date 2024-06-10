import { Component } from '@angular/core';
// ahora se hace en el componente dashboard
//importamos el HTTPclient
//import { HttpClient } from '@angular/common/http';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'HRD_BI_FrontEnd_Responsive';
  //ahora esto se hace en el componente dashboard
  //lista para los usuarios - luego quitar el any no es recomendable trabajar con any pero de momento se quedra asi
  //AQUI SE CAPTARA TODA LA INFORMACION DEL BACKEND por procedimiento almacenado
  //usuarios: any;

  isSideNavCollapsed = false;
  screenWidth = 0;

  // esto es para la funcionalidad de la sidenav
  onToggleSideNav(data: SideNavToggle): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  //ahora esto se hace en el componente dashboard
  //invocacion de modulo -- por procedimiento almacenado listar usuarios
  // constructor(private http: HttpClient){}
  // ngOnInit(): void {
  //   this.http.get("https://localhost:7125/api/Usuarios").subscribe({
  //     next: response => this.usuarios =response,
  //     error: error => console.log(error),
  //     complete: () =>console.log('La solicitud esta completa')
  //   })
  // }
}
