import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from 'src/app/services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTemp: string;

  constructor(
    private subirArchivoService: SubirArchivoService,
    private modalUploadService: ModalUploadService,
  ) { }

  ngOnInit(): void {
  }

  subirImagen() {
    this.subirArchivoService.subirArchivo(
      this.imagenSubir,
      this.modalUploadService.tipo,
      this.modalUploadService.id
    ).then(resp => {
      this.modalUploadService.notificacion.emit(resp);
      this.cerrarModal();
    }).catch(() => {
      console.log('Error en la carga...');
    });
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;

    this.modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo: File) {
      if (!archivo) {
        this.imagenSubir = null;
        return;
      }

      if (archivo.type.indexOf('image') < 0) {
        Swal.fire({
          title: 'Sólo imágenes',
          text: 'El archivo seleccionado no es una imagen',
          icon: 'error',
        });
        this.imagenSubir = null;
        return;
      }

      this.imagenSubir = archivo;

      const reader = new FileReader();
      reader.readAsDataURL(archivo);

      reader.onloadend = () => this.imagenTemp = reader.result as string;
  }
}
