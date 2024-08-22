import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrearParametroComponent } from '../crear-parametro/crear-parametro.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrl: './parametros.component.css'
})
export class ParametrosComponent {

  parametros: any[] = [];

  constructor(private http: HttpClient, private router: Router, private _matDialog: MatDialog) {}

  ngOnInit(): void {
    this.loadParametros();
  }

  // Listar datos de parámetros
  loadParametros(): void {
    this.http.get<any[]>("https://localhost:7125/api/Parametro").subscribe({
      next: response => this.parametros = response,
      error: error => console.log(error),
      complete: () => console.log('La solicitud está completa')
    });
  }

  abrirModal():void{
    const dialogRef = this._matDialog.open(CrearParametroComponent,{ //mat dialog es usado para crear modal dialogs con angular material
      width: '900px',
      height: '900px',
      data: {titulo: 'Abriendo modal desde padre'}
    })

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) { // Si result es true, recargar la lista de parámetros result viene del true o false que le doy en la modal dialog
        this.loadParametros(); //recarga la lista de parametros si viene con el valor true
        //alert('Parámetro creado exitosamente.');
        
      }
    });

  }


}
