import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UsuarioService } from './usuario/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  apiUrl = environment.apiUrl;
  totalMedicos: number;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
  ) { }

  cargarMedicos(): Observable<Medico[]> {
    const url = this.apiUrl + '/medico';

    return this.http.get<{
      ok: boolean,
      medicos: Medico[],
      total: number,
    }>(url)
      .pipe(map(resp => {
        this.totalMedicos = resp.total;

        return resp.medicos;
      }));
  }

  cargarMedico(id: string): Observable<Medico> {
    const url = `${this.apiUrl}/medico/${id}`;

    return this.http.get<{ ok: boolean, medico: Medico, }>(url)
      .pipe(map(resp => resp.medico));
  }

  buscarMedico(termino: string): Observable<Medico[]> {
    const url = `${environment.apiUrl}/busqueda/coleccion\
/medicos/${termino}`;
    return this.http.get<{ ok: boolean, medicos: Medico[], }>(url)
      .pipe(map(resp => resp.medicos));
  }

  borrarMedico(id: string) {
    const url =  `${this.apiUrl}/medico/${id}\
?token=${this.usuarioService.token}`;

    return this.http.delete(url).pipe(map(resp => {
      Swal.fire('Médico Borrado', 'Médico borrado correctamente', 'success');

      return resp;
      }));
  }

  guardarMedico(medico: Medico) {
    let url = `${this.apiUrl}/medico`;

    if (medico._id) {
      // actualizando
      url += `/${medico._id}?token=${this.usuarioService.token}`;

      return this.http.put<{ ok: boolean, medico: Medico, }>(url, medico)
        .pipe(map(resp => {
          Swal.fire('Médico Actualizado', medico.nombre, 'success');

          return resp.medico;
        }));
    } else {
      // creando
      url += `?token=${this.usuarioService.token}`;

      return this.http.post<{ ok: boolean, medico: Medico, }>(url, medico)
        .pipe(map(resp => {
          Swal.fire('Médico Creado', medico.nombre, 'success');

          return resp.medico;
        }));
      }
  }
}
