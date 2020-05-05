import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(
    img: string,
    tipo: 'usuario' | 'hospital' | 'medico' = 'usuario'
  ): string {
    let url = environment.apiUrl + '/img';
    if (!img) {
      return url + '/usuarios/abc';
    }
    if (img.indexOf('googleusercontent') >= 0) {
      return img;
    }
    switch (tipo) {
      case 'usuario':
        url += '/usuarios/' + img;
        break;
      case 'medico':
        url += '/medicos/' + img;
        break;
      case 'hospital':
        url += '/hospitales/' + img;
        break;
      default:
        console.log('Tipo de imagen no existe');
        url += '/usuarios/abc';
    }
    return url;
  }

}
