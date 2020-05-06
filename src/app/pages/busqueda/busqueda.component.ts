import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario } from 'src/app/models/usuario.model';
import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
  ) {
    this.subscription.add(
      this.activatedRoute.params.subscribe(params => {
        console.log(params);
        this.buscar(params.termino);
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buscar(termino: string) {
    const url = `${environment.apiUrl}/busqueda/todo/${termino}`;

    this.http.get<{
      ok: boolean,
      hospitales: Hospital[],
      medicos: Medico[],
      usuarios: Usuario[],
    }>(url).subscribe(resp => {
      console.log(resp);
      this.hospitales = resp.hospitales;
      this.medicos = resp.medicos;
      this.usuarios = resp.usuarios;
    });
  }
}
