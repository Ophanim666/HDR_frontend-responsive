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
}
