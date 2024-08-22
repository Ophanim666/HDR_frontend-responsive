import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-parametro',
  templateUrl: './crear-parametro.component.html',
  styleUrl: './crear-parametro.component.css'
})
export class CrearParametroComponent {
  parametro = {
    parametro:'',
    valor:'',
    iD_TIPO_PARAMETRO: '',
    estado: 1,
    usuariO_CREACION: ''
  };

  constructor(public _matDialogRef: MatDialogRef<CrearParametroComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any, private http: HttpClient, private router: Router
  ){
    console.log(this.data.titulo); 
  }

  onSubmit(): void {
    const url = 'https://localhost:7125/api/Parametro';
    this.http.post(url, this.parametro, { responseType: 'text' })
      .subscribe({
        next: response => {
          console.log(response);
          alert('Parámetro creado exitosamente.');
          //this.router.navigate(['/parametros']); // Navegar de regreso al dashboard
          this._matDialogRef.close(true); // se ocupa para enviar true o false a la pagina padre
        },
        error: error => {
          console.error('Error al crear el Parámetro:', error);
          alert('Error al crear el Parámetro.');
        }
      });

    //this._matDialogRef.close();
    //this.onClose.emit();
  }

  volver(): void {
    //this.router.navigate(['/parametros']);
    //this.onClose.emit();
    this._matDialogRef.close(false);
    
  }

}
