import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ImgsProductos } from '../../Models/Entities.model';

@Component({
  selector: 'app-editar-imagenes',
  templateUrl: './editar-imagenes.component.html',
  styleUrl: './editar-imagenes.component.css'
})
export class EditarImagenesComponent implements OnInit {
  
  fotos:string[]=[]
  @Input() imagenes: ImgsProductos[] = []
  @Output() imagenesEnviar= new EventEmitter<ImgsProductos[]>();
  @Output() abrirModal= new EventEmitter<boolean>();
  eleccionImagen: number = 0

  fileBytes: Uint8Array | undefined;

  ngOnInit(): void {
    this.displayImageFromBytes();
    console.log(this.fotos)
    console.log(this.imagenes)
  }

  cambiarImagen(estaSiguiendo: boolean) {
    if (estaSiguiendo) {
      if (this.imagenes.length - 1 == this.eleccionImagen) {
        this.eleccionImagen = 0;
      } else {
        this.eleccionImagen++;
      }
    }
    if (!estaSiguiendo) {
      if (this.eleccionImagen == 0) {
        this.eleccionImagen = this.imagenes.length - 1;
      } else {
        this.eleccionImagen--;
      }
    }
  }


  CambioImagenes(event: any) {
    if (this.imagenes.length >= 5) {
      alert('Solo se permite subir 5 fotos por producto')
    }else{
      Array.from(event.target.files).forEach((file) => {

        if (this.imagenes.length >= 5) {
          alert('Solo se permite subir 5 fotos por producto')
        }else{
       
          if (file instanceof File) {
  
            const selectedFile: File = file;
            if (selectedFile) {
              const reader = new FileReader();
  
              reader.onload = (e: any) => {
                const arrayBuffer: ArrayBuffer | null = e.target.result;
                if (arrayBuffer) {
                  const uintArray = new Uint8Array(arrayBuffer);
                  this.fileBytes = uintArray;
                  const stringBytes = this.uint8ArrayToBase64(uintArray);
                  let foto: ImgsProductos = new ImgsProductos(0, this.imagenes.length>0?this.imagenes[0].idProPer:0, stringBytes);
                  this.imagenes.push(foto);
                  const byteArray = new Uint8Array(uintArray);
                  const blob = new Blob([byteArray], { type: 'image/jpeg' });
                  let imageUrl = URL.createObjectURL(blob);
                  this.fotos.push(imageUrl);
                }
              };
  
              reader.readAsArrayBuffer(selectedFile);
            }
  
          }
        }
      });      
    }
  }

  private uint8ArrayToBase64(array: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < array.length; i++) {
      binary += String.fromCharCode(array[i]);
    }
    return btoa(binary);
  }

  //----VerFotos
  displayImageFromBytes() {
    // Convertir el ArrayBuffer a un Uint8Array
    for (let i = 0; i < this.imagenes.length; i++) {      
      let encoded=this.base64ToUint8Array(this.imagenes[i].imagen)
      const byteArray = new Uint8Array(encoded);
      
      const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Ajusta el tipo de archivo según el formato de la imagen
      //aqui se pone la imagen
      let imageUrl = URL.createObjectURL(blob);      
      this.fotos.push(imageUrl);
    }
  }


  //De base 64 a bit[]
  private base64ToUint8Array(base64String: string): Uint8Array {
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const uintArray = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      uintArray[i] = binaryString.charCodeAt(i);
    }

    return uintArray;
  }

  eliminarFoto(indice:number){
    this.imagenes.splice(indice,1);
    this.fotos.splice(indice,1);
    this.fotos=[...this.fotos];
    this.imagenes=[...this.imagenes];
    this.eleccionImagen=0;
  }

  confirmar(){
   this.imagenesEnviar.emit(this.imagenes)
   this.abrirModal.emit(false);
  }

}
