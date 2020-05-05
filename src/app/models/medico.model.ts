import { Usuario } from './usuario.model';
import { Hospital } from './hospital.model';

export class Medico {
  constructor(
    public nombre: string,
    public usuario?: Usuario,
    public hospital?: Hospital | string,
    public img?: string,
    public _id?: string,
  ) {}
}
