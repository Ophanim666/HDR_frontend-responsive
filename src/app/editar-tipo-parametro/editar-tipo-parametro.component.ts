// <!-- esta malo no carga los datos -->

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-tipo-parametro',
  templateUrl: './editar-tipo-parametro.component.html',
  styleUrls: ['./editar-tipo-parametro.component.css']
})
export class EditarTipoParametroComponent implements OnInit {
  tipoParametro: any = {
    id: null,
    TIPO_PARAMETRO: '',
    ESTADO: null,
    USUARIO_CREACION: '',
    FECHA_CREACION: null
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTipoParametro();
  }

  cargarTipoParametro(): void {
    const id = this.route.snapshot.params['id'];
    this.http.get<any>(`https://localhost:7125/api/TipoParametro/${id}`).subscribe({
      next: response => {
        // Asegúrate de que la fecha esté en formato adecuado para el input de tipo date
        response.FECHA_CREACION = new Date(response.FECHA_CREACION).toISOString().split('T')[0];
        this.tipoParametro = response;
        console.log('Datos cargados:', this.tipoParametro);
      },
      error: error => {
        console.error('Error al cargar el Tipo de Parámetro:', error);
        alert('Error al cargar el Tipo de Parámetro.');
      }
    });
  }

  actualizarTipoParametro(): void {
    const id = this.tipoParametro.id;
    this.http.put(`https://localhost:7125/api/TipoParametro/${id}`, this.tipoParametro).subscribe({
      next: response => {
        console.log('Respuesta del servidor:', response);
        alert('Tipo de Parámetro actualizado correctamente.');
        this.router.navigate(['/gestion-tipo-parametros']);
      },
      error: error => {
        console.error('Error al actualizar el Tipo de Parámetro:', error);
        alert('Error al actualizar el Tipo de Parámetro.');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/gestion-tipo-parametros']);
  }
}
