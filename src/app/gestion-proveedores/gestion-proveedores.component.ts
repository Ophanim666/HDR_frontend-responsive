import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-gestion-proveedores',
  templateUrl: './gestion-proveedores.component.html',
  styleUrls: ['./gestion-proveedores.component.css']
})
export class GestionProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  currentProveedores: any = {};
  proveedorDelete: number | null = null;
  showModalProveedores = false;
  showConfirmationDeleteProveedores = false;
  searchText: string = '';
  isEditMode = false;
  pagedProveedores: any[] = [];
  private apiUrl = 'https://localhost:7125/api/Proveedor';
  // URL de Especialidad 
  private apiUrl2 = 'https://localhost:7125/api/Especialidad';

  // lista para especilidades
  especialidades = new FormControl();
  especialidadList: string[] = [];


  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProveedores();
    this.loadListEspecialidad();
  }

  // Filtrar proveedores
  filteredProveedores() {
    return this.proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  
  loadListEspecialidad(): void {
    this.http.get<any>(`${this.apiUrl2}/ListadoDeespecialidadesSimple`).subscribe({
      next: response => {
        // Verificamos que la respuesta sea exitosa
        if (response.estado.ack) {
          // Asignamos los nombres de las especialidades a especialidadList
          this.especialidadList = response.body.response.map((especialidad: any) => especialidad.nombre);
  
          // Imprimimos las especialidades cargadas para verificar en consola
          console.log('Especialidades cargadas:', this.especialidadList);
        } else {
          this.showError(`Error al cargar las especialidades: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      },
      complete: () => console.log('Carga de especialidades completa')
    });
  }


  // Listar datos de proveedores
  loadProveedores(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.proveedores = response.body.response;
          this.updatePageProveedor();
          console.log('Proveedores cargados:', this.proveedores);
        } else {
          this.showError(`Error al cargar los Proveedores: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      },
      complete: () => console.log('Carga de proveedores completa')
    });
  }

    // Actualizar las especialidades paginadas
    updatePageProveedor(): void {
      const filtered = this.filteredProveedores();
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.pagedProveedores = filtered.slice(startIndex, endIndex);
      this.paginator.length = filtered.length;
    }

    // Método que se llama cuando cambia el texto de búsqueda
  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePageProveedor();
  }

  // Abre el modal de proveedores
  openModalProveedor(proveedor?: any): void {
    this.isEditMode = !!proveedor;
    this.currentProveedores = proveedor ? { ...proveedor } : {
      nombre: '',
      estado: 1,
      rut:'',
      dv: '',
    };
    this.showModalProveedores = true;
    document.body.classList.add('modal-open');
  }

    // Método que maneja el cambio en el toggle 
    onToggleChange(event: MatSlideToggleChange): void {
      this.currentProveedores.estado = event.checked ? 1 : 0;
    }

   // Cerrar el modal de especialidad
   closeModalProveedor(): void {
    this.showModalProveedores = false;
    document.body.classList.remove('modal-open');
  }

  // Método para guardar una especialidad
  saveProveedor(): void {
    if (this.isEditMode) {
      this.updateProveedor();  // Si está en modo edición, llama a updateEspecialidad
    } else {
      this.createProveedor();  // Si no, llama a createEspecialidad
    }
  }

  // Agregar Proveedor
 createProveedor(): void {
  this.http.post(`${this.apiUrl}/add`, this.currentProveedores).subscribe({
    next: (response: any) => {
      if (response.estado.ack) {
        console.log('Proveedor creado:', response);
        this.showError('Proveedor creado exitosamente.', false);
        this.loadProveedores();
        this.closeModalProveedor();
      } else {
        this.showError(`Error al crear el Proveedor: ${response.estado.errDes}`, true);
      }
    },
    error: error => {
      console.error('Error en la solicitud:', error);
      this.showError('Error en la solicitud.', true);
    }
  });
}

 // Editar Proveedor
 updateProveedor(): void {
  const url = `${this.apiUrl}/${this.currentProveedores.id}`;
  const updatedData = {
    id: this.currentProveedores.id,
    nombre: this.currentProveedores.nombre,
    razoN_SOCIAL: this.currentProveedores.razoN_SOCIAL, // Nota el cambio aquí
    rut: this.currentProveedores.rut,
    dv: this.currentProveedores.dv,
    nombrE_CONTACTO_PRINCIPAL: this.currentProveedores.nombrE_CONTACTO_PRINCIPAL, // Y aquí
    numerO_CONTACTO_PRINCIPAL: this.currentProveedores.numerO_CONTACTO_PRINCIPAL, // Y aquí
    nombrE_CONTACTO_SECUNDARIO: this.currentProveedores.nombrE_CONTACTO_SECUNDARIO, // Y aquí
    numerO_CONTACTO_SECUNDARIO: this.currentProveedores.numerO_CONTACTO_SECUNDARIO, // Y aquí
    estado: this.currentProveedores.estado
  };

  this.http.put<any>(url, updatedData).subscribe({
    next: (response: any) => {
      if (response?.estado?.ack) {
        console.log('Proveedor actualizado:', response);
        this.showError('Proveedor actualizado exitosamente.', false);
        this.loadProveedores();
        this.closeModalProveedor();
      } else {
        this.showError(`Error al actualizar el Proveedor: ${response?.estado?.errDes || 'Error desconocido'}`, true);
      }
    },
    error: (error) => {
      console.error('Error en la solicitud:', error);
      this.showError('Error en la solicitud al actualizar el Proveedor.', true);
    }
  });
}

  // Confirmar eliminación
  confirmDelete(id: number): void {
    this.proveedorDelete = id;
    this.showModalProveedores = false;
    this.showConfirmationDeleteProveedores = true;
  }
  

   // Cerrar el diálogo de confirmación de eliminación
   closeConfirmationDialog(): void {
    this.showConfirmationDeleteProveedores = false;
    this.showModalProveedores = true;
    this.proveedorDelete = null;
  }

  // Eliminar proveedor
  deleteProveedor(): void {
    if (this.proveedorDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/${this.proveedorDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            console.log('Proveedor eliminado:', response);
            this.showError('Proveedor eliminado exitosamente.', false);
            this.loadProveedores();
            this.closeConfirmationDialog();
            this.closeModalProveedor();
          } else {
            this.showError(`Error al eliminar el Proveedor: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar el Proveedor.', true);
        }
      });
    }
  }

   // Mostrar un mensaje de error o éxito
  showError(message: string, isError: boolean): void {
    this.errorMessage = { message, isError };
    this.showErrorModal = true;
  }

    // Cerrar el modal de error
  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = { message: '', isError: true };
  }

  // Método que se llama cuando cambia la página en el paginador
  onPageChange(event: PageEvent) {
    this.updatePageProveedor();   // Actualiza los proveedores paginados para mostrar la nueva página
  }

}
