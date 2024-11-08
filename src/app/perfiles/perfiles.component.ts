import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.css'
})
export class PerfilesComponent {
  usuarios: any[] = [];
  currentUsuarios: any = {};
  showModalUsuarios = false;
  isEditMode = false;

  usuarioDelete: number | null = null;
  showConfirmationDeleteUsuarios = false;

  //paginacion de usuarios
  pagedUsuarios: any[] = [];
  searchText: string = '';

  //URL
  private apiUrl = 'https://localhost:7125/api/Usuarios';

  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
 
  constructor(private http: HttpClient){}
  ngOnInit(): void {
  this.loadUsuarios();
  }

  // Filtrar usuarios
  filteredUsuarios() {
    return this.usuarios.filter(usuario =>
      usuario.primer_nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

   // Actualizar los usuarios en las paginas
   updatePageUsuario(): void {
    const filtered = this.filteredUsuarios(); // en proceso
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedUsuarios = filtered.slice(startIndex, endIndex);
    this.paginator.length = filtered.length;
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

    // Método que se llama cuando cambia el texto de búsqueda
    onSearchChange(): void {
      this.paginator.firstPage();
      this.updatePageUsuario();
    }

    // Método que se llama cuando cambia la página en el paginador
  onPageChange(event: PageEvent) {
    this.updatePageUsuario();
  }

  // Abre el modal de usuarios
  openModalUsuario(usuario?: any): void {
    this.isEditMode = !!usuario;
    this.currentUsuarios = usuario ? { ...usuario } : {
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      rut:'',
      dv: '',
      email: '',
      password: '',
      es_administrador: 1,
      rol_id: '',
      estado: 1,
    };
    this.showModalUsuarios = true;
    document.body.classList.add('modal-open');
  }
  //.....

  // Cerrar el modal de usuarios
  closeModalUsuario(): void {
    this.showModalUsuarios = false;
    document.body.classList.remove('modal-open');
  }

  onToggleChange(event: MatSlideToggleChange, type: string): void {
    if (type === 'estado') {
      this.currentUsuarios.estado = event.checked ? 1 : 0;
    } else if (type === 'es_administrador') {
      this.currentUsuarios.es_administrador = event.checked ? 1 : 0;
    }
  }

   // Guardar Usuario nuevo
   saveUsuario(): void {
      if (this.isEditMode) {
      this.updateUsuario();
    } else {
      this.createUsuario();
    }
  }


  // Listado de Usuarios ...........
  loadUsuarios(): void {
    this.http.get<any>(`${this.apiUrl}/ListarUsuarios`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.usuarios = response.body.response.map((usuario: any) => ({
            id: usuario.id,
            primer_nombre: usuario.primer_nombre,
            segundo_nombre: usuario.segundo_nombre,
            primer_apellido: usuario.primer_apellido,
            segundo_apellido: usuario.segundo_apellido,
            rut: usuario.rut,
            dv: usuario.dv,
            email: usuario.email,
            password: usuario.password,
            es_administrador: usuario.es_administrador,
            rol_id: usuario.rol_id,
            estado: usuario.estado
          }));
          this.updatePageUsuario();
          console.log('Usuarios cargados:', this.usuarios);
        } else {
          this.showError(`Error al cargar los Usuarios: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      },
      complete: () => console.log('Carga de usuarios completa')
    });
  }
  //...............


  // Creacion de Usuarios ..............
  createUsuario(): void {
    this.http.post(`${this.apiUrl}/add`, this.currentUsuarios).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          console.log('Usuario creado:', response);
          this.showError('Usuario creado exitosamente.', false);
          this.loadUsuarios();
          this.closeModalUsuario();
        } else {
          this.showError(`Error al crear el Usuario: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }
  //...............


   // Editar Usuarios .......
   updateUsuario(): void {
    const url = `${this.apiUrl}/Actualizar/${this.currentUsuarios.id}`;
    const updatedData = {
            primer_nombre: this.currentUsuarios.primer_nombre,
            segundo_nombre: this.currentUsuarios.segundo_nombre,
            primer_apellido: this.currentUsuarios.primer_apellido,
            segundo_apellido: this.currentUsuarios.segundo_apellido,
            rut: this.currentUsuarios.rut,
            dv: this.currentUsuarios.dv,
            email: this.currentUsuarios.email,
            password: this.currentUsuarios.password,
            es_administrador: this.currentUsuarios.es_administrador,
            rol_id: this.currentUsuarios.rol_id,
            estado: this.currentUsuarios.estado
    };

    this.http.put<any>(url, updatedData).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          console.log('Usuario actualizado:', response);
          this.showError('Usuario actualizado exitosamente.', false);
          this.loadUsuarios();
          this.closeModalUsuario();
        } else {
          this.showError(`Error al actualizar el Usuario: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar el Usuario.', true);
      }
    });
  }
  //...............

  // Confirmar eliminación
  confirmDelete(id: number): void {
    this.usuarioDelete = id;
    this.showModalUsuarios = false;
    this.showConfirmationDeleteUsuarios = true;
  }

  // Cerrar el diálogo de confirmación de eliminación
  closeConfirmationDialog(): void {
    this.showConfirmationDeleteUsuarios = false;
    this.showModalUsuarios = true;
    this.usuarioDelete = null;
  }

  // Eliminar proveedor
  deleteProveedor(): void {
    if (this.usuarioDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/Eliminar/${this.usuarioDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            console.log('Usuario eliminado:', response);
            this.showError('Usuario eliminado exitosamente.', false);
            this.loadUsuarios();
            this.closeConfirmationDialog();
            this.closeModalUsuario();
          } else {
            this.showError(`Error al eliminar el Usuario: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar el Usuario.', true);
        }
      });
    }
  }

  // Apartado donde se cambia el formato y se le ponen restricciones al rut y dv

  // Método para permitir solo números (para el campo RUT)
  onlyNumbers(event: KeyboardEvent): void {
    const pattern = /[0-9]/; // Solo números
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Evitar el ingreso de caracteres no válidos
    }
  }

  // Método para permitir solo un carácter (para el campo DV)
  onlyOneCharacter(event: KeyboardEvent): void {
    const pattern = /[0-9A-Za-z]/; // Solo números y letras
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Evitar el ingreso de caracteres no válidos
    }
  }
  
  //Cambia el Formato del Rut 
   formatRut(rut: string): string {
    if (rut.length !== 8) return rut; // Asegúrate de que tenga el largo esperado

    return `${rut.slice(0, 2)}.${rut.slice(2, 5)}.${rut.slice(5, 8)}`; // Formateo
  }
  //...............................


}

