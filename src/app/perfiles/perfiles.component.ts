import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormControl } from '@angular/forms';




//Aqui van las interfaces
interface Parametro {
  id?: number;
  parametro: string;
  // valor: string;
  iD_TIPO_PARAMETRO: number; // Cambiado para coincidir con la API
  // estado: number;
}

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.css'
})
export class PerfilesComponent {
  parametros: Parametro[] = [];
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
  private apiUrlParametro = 'https://localhost:7125/api/Parametro';

  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
 
  constructor(private http: HttpClient){}
  ngOnInit(): void {
  this.loadUsuarios();
  this.loadParametros();
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
      es_administrador: 0,
      rol_id: 0,
      estado: 0,
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

  onToggleChange(event: any, type: string): void {
    if (type === 'estado') {
      // Si el evento es de tipo toggle (mat-slide-toggle), usamos `event.checked`
      this.currentUsuarios.estado = event.checked ? 1 : 0;
    } else if (type === 'es_administrador') {
      // Si el evento es de tipo checkbox (mat-checkbox), también usamos `event.checked`
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

  //Listar los Parametros ........
  loadParametros(): void {
    this.http.get<any>(`${this.apiUrlParametro}/Listar`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.parametros = response.body.response;
          // this.updatePageParametro();
        } else {
          this.showError(`Error al cargar los Usuarios: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      }
    });
  }
  //.....................

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
    console.log(this.currentUsuarios.es_administrador)
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
    console.log(this.currentUsuarios.es_administrador);
    this.http.put<any>(url, this.currentUsuarios).subscribe({
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

  //Obtener los nombres de parametros .................
  getRolNombre(id: number): string {
    const rol = this.parametros.find(elemento => {
        return elemento.id === id;
    });

    if (!rol) {
        return `Tipo ${id}`;
    }

    return rol.parametro; 
  }
  //..........................

}

