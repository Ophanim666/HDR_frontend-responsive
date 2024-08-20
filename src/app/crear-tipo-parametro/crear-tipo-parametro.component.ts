import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-tipo-parametro',
  templateUrl: './crear-tipo-parametro.component.html',
  styleUrls: ['./crear-tipo-parametro.component.css']
})
export class CrearTipoParametroComponent {
  tipoParametro = {
    id: 0,
    tipO_PARAMETRO: '',
    estado: 1,
    usuariO_CREACION: '',
    fechA_CREACION: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    const url = 'https://localhost:7125/api/TipoParametro';
    this.http.post(url, this.tipoParametro, { responseType: 'text' })
      .subscribe({
        next: response => {
          console.log(response);
          alert('Tipo de Parámetro creado exitosamente.');
          this.router.navigate(['/gestion-tipo-parametros']); // Navegar de regreso al dashboard
        },
        error: error => {
          console.error('Error al crear el Tipo de Parámetro:', error);
          alert('Error al crear el Tipo de Parámetro.');
        }
      });
  }

  volver(): void {
    this.router.navigate(['/gestion-tipo-parametros']);
  }
}
