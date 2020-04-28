import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.cargarStorage();
  }

  estaLogueado(): boolean {
    return this.token.length > 5 ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  logout(): void {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = environment.apiUrl + '/login/google';

    return this.http.post<{
      ok: boolean,
      usuario: Usuario,
      token: string,
      id: string,
    }>(url, { token }).pipe(
      map(resp => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      })
    );
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  login(usuario: Usuario, recuerdame: boolean  = false): Observable<boolean> {
    const url = environment.apiUrl + '/login';
    if (recuerdame) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    return this.http.post<{
      ok: boolean,
      usuario: Usuario,
      token: string,
      id: string,
    }>(url, usuario).pipe(
      map(
        resp => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
        },
      ),
    );
  }
  crearUsuario(usuario: Usuario) {
    const url = environment.apiUrl + '/usuario';
    return this.http.post<{
      ok: boolean,
      usuario: Usuario,
    }>(url, usuario).pipe(
      map(
        (resp) => {
          Swal.fire({
            title: 'Usuario creado',
            text: usuario.email,
            icon: 'success',
          });
          return resp.usuario;
        },
      ),
    );
  }
}
