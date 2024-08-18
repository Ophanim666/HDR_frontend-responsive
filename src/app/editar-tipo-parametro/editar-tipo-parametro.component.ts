import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-tipo-parametro',
  templateUrl: './editar-tipo-parametro.component.html',
  styleUrls: ['./editar-tipo-parametro.component.css']
})
export class EditarTipoParametroComponent implements OnInit {
  tipoParametro: any = {};
  tipoParametros: any[] = [];
  apiUrl: string = 'https://localhost:7125/api/TipoParametro';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
