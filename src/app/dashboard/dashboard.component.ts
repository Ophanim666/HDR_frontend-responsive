import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  usuarios: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  //Listar datos de usuario
  loadUsers(): void {
    this.http.get("https://localhost:7125/api/Usuarios").subscribe({
      next: response => this.usuarios = response,
      error: error => console.log(error),
      complete: () => console.log('La solicitud está completa')
    });
  }

  changeRole(userId: number): void {
    console.log('Cambiar rol del usuario con ID:', userId);
    // Aquí puedes añadir la lógica para cambiar el rol del usuario
  }

//funcion de eliminar es un softdelete que eliminara a los usuarios del sistema pero quedaran el la base de datos
  deleteUser(userId: number): void {
    console.log('Eliminar usuario con ID:', userId);
  }
}
//jejejeje
