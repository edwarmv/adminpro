import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
  ) { }

  /**
   * desde - Desde que posisión se hará la petición.
   */
  cargarHospitales(desde: number): Observable<{
    hospitales: Hospital[],
    total: number,
  }> {
    const url = `${this.apiUrl}/hospital?desde=${desde}`;

    return this.http.get<{
      ok: boolean,
      hospitales: Hospital[],
      total: number,
    }>(url);
  }

  obtenerHospital(id: string): Observable<Hospital> {
    const url = `${this.apiUrl}/hospital/${id}`;

    return this.http.get<{ok: boolean, hospital: Hospital}>(url)
      .pipe(map(resp => resp.hospital));
  }

  borrarHospital(id: string): Observable<void> {
    const url = `${this.apiUrl}/hospital/${id}\
?token=${this.usuarioService.token}`;

    return this.http.delete<{ok: boolean, hospital: Hospital}>(url)
    .pipe(map(() => {
      Swal.fire({
        title: 'Hospital borrado',
        text: 'Hospital borrado exitosamente',
        icon: 'success',
      });
    }));
  }

  crearHospital(nombre: string) {
    const url = `${this.apiUrl}/hospital?token=${this.usuarioService.token}`;

    return this.http.post<{ ok: boolean, hospital: Hospital, }>(url, { nombre });
  }

  buscarHospital(termino: string): Observable<Hospital[]> {
    const url = `${this.apiUrl}/busqueda/coleccion/hospitales/${termino}`;

    return this.http.get<{ ok: boolean, hospitales: Hospital[], }>(url)
      .pipe(map(resp => resp.hospitales));
  }

  actualizarHospital(hospital: Hospital): Observable<void> {
    const url = `${this.apiUrl}/hospital/${hospital._id}\
?token=${this.usuarioService.token}`;

    return this.http.put(url, hospital).pipe(map(() => {
      Swal.fire({
        title: 'Hospital actualizado',
        text: 'Hospital ' + hospital.nombre + ' actualizado correctamente',
        icon: 'success',
      });
    }));
  }
}
