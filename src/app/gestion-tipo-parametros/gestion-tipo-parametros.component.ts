import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-tipo-parametros',
  templateUrl: './gestion-tipo-parametros.component.html',
  styleUrls: ['./gestion-tipo-parametros.component.css']
})
export class GestionTipoParametrosComponent implements OnInit {
  tipoParametros: any[] = [];
  showConfirmationDialog = false;
  tipoParametroIdToDelete: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadTipoParametros();
  }

  // Listar datos de tipo de parámetro
  loadTipoParametros(): void {
    this.http.get<any[]>("https://localhost:7125/api/TipoParametro").subscribe({
      next: response => this.tipoParametros = response,
      error: error => console.log(error),
      complete: () => console.log('La solicitud está completa')
    });
  }

  // Confirmar eliminación
  confirmDelete(id: number): void {
    this.tipoParametroIdToDelete = id;
    this.showConfirmationDialog = true;
  }

  // Eliminar tipo de parámetro
  deleteTipoParametro(): void {
    if (this.tipoParametroIdToDelete !== null) {
      const url = `https://localhost:7125/api/TipoParametro/${this.tipoParametroIdToDelete}`;
      this.http.delete(url, { responseType: 'text' })
        .subscribe({
          next: response => {
            console.log(response);
            alert(response); // Mostrar la respuesta del servidor
            // Actualizar la lista después de eliminar
            this.tipoParametros = this.tipoParametros.filter(tp => tp.id !== this.tipoParametroIdToDelete);
            this.cancelDelete();
          },
          error: error => {
            console.error('Error eliminando el tipo de parámetro:', error);
            alert('Error eliminando el tipo de parámetro.');
          }
        });
    }
  }

  // Cancelar eliminación
  cancelDelete(): void {
    this.showConfirmationDialog = false;
    this.tipoParametroIdToDelete = null;
  }
}
