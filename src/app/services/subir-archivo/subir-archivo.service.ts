import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';
import { Usuario } from 'src/app/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo(archivo: File, tipo: string, id: string) {
    return new Promise<{
      mensaje: string,
      ok: boolean,
      usuario: Usuario,
    }>((resolve, reject) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('imagen', archivo, archivo.name);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            console.log('Falló la subida');
            reject(xhr.response);
          }
        }
      };

      const url = `${environment.apiUrl}/upload/${tipo}/${id}`;

      xhr.open('PUT', url, true);
      xhr.send(formData);
    });
  }
}
