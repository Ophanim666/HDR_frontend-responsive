import { Component } from '@angular/core';
//importamos el HTTPclient
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tarea',
  templateUrl: './gestion-tarea.component.html',
  styleUrl: './gestion-tarea.component.css'
})
export class GestionTareaComponent {
  //lista para los usuarios - luego quitar el any no es recomendable trabajar con any pero de momento se quedra asi
  //AQUI SE CAPTARA TODA LA INFORMACION DEL BACKEND por procedimiento almacenado
  tareas: any;

  //invocacion de modulo -- por procedimiento almacenado listar usuarios
  constructor(private http: HttpClient){}
  ngOnInit(): void {
    this.http.get("https://localhost:7125/api/Tarea").subscribe({
      next: response => this.tareas =response,
      error: error => console.log(error),
      complete: () =>console.log('La solicitud esta completa')
    })
  }

}
