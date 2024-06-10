import { Component } from '@angular/core';
//importamos el HTTPclient
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.css'
})
export class PerfilesComponent {
  //lista para los usuarios - luego quitar el any no es recomendable trabajar con any pero de momento se quedra asi
  //AQUI SE CAPTARA TODA LA INFORMACION DEL BACKEND por procedimiento almacenado
  usuarios: any;

  //invocacion de modulo -- por procedimiento almacenado listar usuarios
  constructor(private http: HttpClient){}
  ngOnInit(): void {
    this.http.get("https://localhost:7125/api/Usuarios").subscribe({
      next: response => this.usuarios =response,
      error: error => console.log(error),
      complete: () =>console.log('La solicitud esta completa')
    })
  }
}
