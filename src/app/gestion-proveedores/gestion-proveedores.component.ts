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
  //no es string es any para que lleguen los nombres
  especialidadList: any[] = [];


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

  // Listado de especialidades
  // En este método cargamos las especialidades y almacenamos tanto el nombre como el id.
loadListEspecialidad(): void {
  this.http.get<any>(`${this.apiUrl2}/ListadoDeespecialidadesSimple`).subscribe({
    next: response => {
      if (response.estado.ack) {
        // Ahora almacenamos tanto el nombre como el id de cada especialidad
        this.especialidadList = response.body.response.map((especialidad: any) => ({
          id: especialidad.id,        // Capturamos el id de la especialidad
          nombre: especialidad.nombre  // Y el nombre para mostrarlo en el formulario
        }));

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
//....



  // Listar datos de proveedores
// Listar datos de proveedores con especialidades
loadProveedores(): void {
  this.http.get<any>(`${this.apiUrl}/Listado`).subscribe({
    next: response => {
      if (response.estado.ack) {
        // Actualizamos la lógica para reflejar la nueva estructura de respuesta
        this.proveedores = response.body.response.map((proveedor: any) => ({
          id: proveedor.iDproveedor,
          nombre: proveedor.nombreProveedor,
          razonSocial: proveedor.razonSocial,
          rut: proveedor.rut,
          dv: proveedor.dv,
          nombreContactoPri: proveedor.nombreContactoPri,
          numeroContactoPri: proveedor.numeroContactoPri,
          nombreContactoSec: proveedor.nombreContactoSec,
          numeroContactoSec: proveedor.numeroContactoSec,
          estado: proveedor.estado,
          // Guardamos las especialidades por su ID para poder seleccionarlas
          iDespecialidad: proveedor.iDespecialidad,
          especialidades: proveedor.nombreEspecialidad.join(', ')
        }));

        this.updatePageProveedor();  // Actualiza la paginación
        console.log('Proveedores con especialidades cargados:', this.proveedores);
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
      nombrE_CONTACTO_PRINCIPAL: '',
      numerO_CONTACTO_PRINCIPAL: '',
      nombrE_CONTACTO_SECUNDARIO: '',
      numerO_CONTACTO_SECUNDARIO: '',
      listaEspecialidades: []
    };
    this.showModalProveedores = true;
    document.body.classList.add('modal-open');
  }

    // Método que maneja el cambio en el toggle
    onToggleChange(event: MatSlideToggleChange): void {
      this.currentProveedores.estado = event.checked ? 1 : 0;
    }


// Cerrar el modal de proveedor y limpiar las especialidades seleccionadas
closeModalProveedor(): void {
  this.showModalProveedores = false;
  document.body.classList.remove('modal-open');

  // Limpiar las especialidades seleccionadas
  this.especialidades.reset();  // Limpiamos el FormControl de especialidades
}




  // Método para guardar una especialidad
  saveProveedor(): void {
    // Aquí obtenemos los IDs de las especialidades seleccionadas en el formulario
    this.currentProveedores.listaEspecialidades = this.especialidades.value;

    if (this.isEditMode) {
      this.updateProveedor();
    } else {
      this.createProveedor();
    }
  }
  //......

//-----------------------------------------------------------
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
//....

 // Editar Proveedor
// Editar Proveedor
updateProveedor(): void {
  const url = `${this.apiUrl}/Actualizar/${this.currentProveedores.id}`;
  const updatedData = {
    id: this.currentProveedores.id,
    nombre: this.currentProveedores.nombre,
    razoN_SOCIAL: this.currentProveedores.razoN_SOCIAL,
    rut: this.currentProveedores.rut,
    dv: this.currentProveedores.dv,
    nombrE_CONTACTO_PRINCIPAL: this.currentProveedores.nombrE_CONTACTO_PRINCIPAL,
    numerO_CONTACTO_PRINCIPAL: this.currentProveedores.numerO_CONTACTO_PRINCIPAL,
    nombrE_CONTACTO_SECUNDARIO: this.currentProveedores.nombrE_CONTACTO_SECUNDARIO,
    numerO_CONTACTO_SECUNDARIO: this.currentProveedores.numerO_CONTACTO_SECUNDARIO,
    estado: this.currentProveedores.estado,

    // investigar si se pueden trabajar 2 url dentro de crear y actualizar para distintos datos
    //estos datos estan en la url de proveedor con especialidad
    listaEspecialidades: this.currentProveedores.listaEspecialidades
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
