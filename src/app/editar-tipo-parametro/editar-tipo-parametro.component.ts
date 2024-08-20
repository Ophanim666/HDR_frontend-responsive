import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-tipo-parametro',
  templateUrl: './editar-tipo-parametro.component.html',
  styleUrls: ['./editar-tipo-parametro.component.css']
})
export class EditarTipoParametroComponent implements OnInit {
  tipoParametros: any[] = [];
  apiUrl: string = 'https://localhost:7125/api/TipoParametro';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTipoParametros();
  }

  // Listar datos de tipo de parámetro
  loadTipoParametros(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: response => {
        console.log('Datos de tipo de parámetros cargados:', response);
        this.tipoParametros = response;
      },
      error: error => {
        console.error('Error al cargar los datos de tipo de parámetros:', error);
      },
      complete: () => console.log('La solicitud de carga de tipos de parámetros está completa')
    });
  }

  // Actualizar un tipo de parámetro
  updateTipoParametro(tipoParametro: any): void {
    const url = `${this.apiUrl}/${tipoParametro.id}`;
    const updatedData = {
      tipO_PARAMETRO: tipoParametro.tipO_PARAMETRO,
      estado: tipoParametro.estado,
      usuariO_CREACION: tipoParametro.usuariO_CREACION,
      fechA_CREACION: tipoParametro.fechA_CREACION
    };

    this.http.put(url, updatedData, { responseType: 'text' }).subscribe({
      next: response => {
        console.log('Tipo de parámetro actualizado:', response);
        this.loadTipoParametros(); // Recargar la lista después de la actualización
      },
      error: error => {
        console.error('Error al actualizar el tipo de parámetro:', error);
      }
    });
  }
  //boton volver
  volver(): void {
    this.router.navigate(['/gestion-tipo-parametros']);
  }
}
