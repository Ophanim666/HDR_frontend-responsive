import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {
  parametros: any[] = [];
  currentParametro: any = {};
  parametroDelete: number | null = null;
  showModalParametro = false;
  showConfirmationDeleteParametro = false;
  searchText: string = '';
  isEditMode = false;
  pagedParametros: any[] = [];
  tipoParametros: any[] = [];
  private apiUrl = 'https://localhost:7125/api/Parametro';
  private apiUrlTipoParametro = 'https://localhost:7125/api/TipoParametro';

  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadParametros();
    this.loadTipoParametros();
  }

  loadTipoParametros(): void {
    this.http.get<any>(`${this.apiUrlTipoParametro}/LstTipoParametros`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.tipoParametros = response.body.response;
        } else {
          this.showError(`Error al cargar los tipos de parámetros: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los tipos de parámetros:', error);
        this.showError('Error en la solicitud al cargar los tipos de parámetros.', true);
      }
    });
  }

  filteredParametros() {
    return this.parametros.filter(parametro =>
      parametro.parametro.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  loadParametros(): void {
    this.http.get<any>(`${this.apiUrl}/Listar`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.parametros = response.body.response;
          this.updatePageParametro();
        } else {
          this.showError(`Error al cargar los Parámetros: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      }
    });
  }

  updatePageParametro(): void {
    const filtered = this.filteredParametros();
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedParametros = filtered.slice(startIndex, endIndex);
    this.paginator.length = filtered.length;
  }

  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePageParametro();
  }

  openModalParametro(parametro?: any): void {
    this.isEditMode = !!parametro;
    this.currentParametro = parametro ? { ...parametro } : {
      parametro: '',
      valor: '',
      tipO_PARAMETRO: '',
      estado: 1
    };
    this.showModalParametro = true;
    document.body.classList.add('modal-open');
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.currentParametro.estado = event.checked ? 1 : 0;
  }

  closeModalParametro(): void {
    this.showModalParametro = false;
    document.body.classList.remove('modal-open');
  }

  saveParametro(): void {
    if (this.isEditMode) {
      this.updateParametro();
    } else {
      this.createParametro();
    }
  }

  createParametro(): void {
    this.http.post(`${this.apiUrl}/add`, this.currentParametro).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          this.showError('Parámetro creado exitosamente.', false);
          this.loadParametros();
          this.closeModalParametro();
        } else {
          this.showError(`Error al crear el Parámetro: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }

  updateParametro(): void {
    const url = `${this.apiUrl}/Actualizar/${this.currentParametro.id}`;
    this.http.put<any>(url, this.currentParametro).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          this.showError('Parámetro actualizado exitosamente.', false);
          this.loadParametros();
          this.closeModalParametro();
        } else {
          this.showError(`Error al actualizar el Parámetro: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar el Parámetro.', true);
      }
    });
  }

  confirmDelete(id: number): void {
    this.parametroDelete = id;
    this.showModalParametro = false;
    this.showConfirmationDeleteParametro = true;
  }

  closeConfirmationDialog(): void {
    this.showConfirmationDeleteParametro = false;
    this.showModalParametro = true;
    this.parametroDelete = null;
  }

  deleteParametro(): void {
    if (this.parametroDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/Eliminar/${this.parametroDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            this.showError('Parámetro eliminado exitosamente.', false);
            this.loadParametros();
            this.closeConfirmationDialog();
            this.closeModalParametro();
          } else {
            this.showError(`Error al eliminar el Parámetro: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar el Parámetro.', true);
        }
      });
    }
  }

  showError(message: string, isError: boolean): void {
    this.errorMessage = { message, isError };
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = { message: '', isError: true };
  }

  onPageChange(event: PageEvent) {
    this.updatePageParametro();
  }

  getTipoParametroNombre(id: number): string {
    const tipoParametro = this.tipoParametros.find(tipo => tipo.id === id);
    return tipoParametro ? tipoParametro.tipO_PARAMETRO : 'Desconocido';
  }
}