import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SFacturasService } from '../../services/sfacturas.service';
import { Productos } from '../../Models/Entities.model';

@Component({
  selector: 'app-buscar-productos',
  templateUrl: './buscar-productos.component.html',
  styleUrl: './buscar-productos.component.scss'
})
export class BuscarProductosComponent implements OnInit {
  @Output() cerrar = new EventEmitter<boolean>();
  @Output() productosRegresar = new EventEmitter<Productos[]>();
  @Input() listaProductos: Productos[] = []
  listaProductosFiltrados: Productos[] = []
  seleccionBuscar: string = '1';
  filtro: string = '';
  buscarPorId:boolean=false
  p: number = 1;


  constructor(public sFacturas: SFacturasService) { }
  ngOnInit(): void {
    this.listaProductosFiltrados = this.listaProductos;
  }

  BuscarProductos() {
    if (this.buscarPorId) {
      this.listaProductosFiltrados = this.listaProductos.filter(x => x.idProducto == parseInt(this.filtro))
    } else {
      this.listaProductosFiltrados = this.listaProductos.filter(x => x.idProducto == parseInt(this.filtro)
        || x.nombre.toLowerCase().includes(this.filtro.toLowerCase()) || x.precio == parseFloat(this.filtro) || x.stock == parseFloat(this.filtro))
    }
  }

  actualizarEstadoProducto(idProducto: number, evento: Event,) {
    const inputElement = evento.target as HTMLInputElement;
    var index = this.listaProductos.findIndex(producto => producto.idProducto == idProducto);
    if (inputElement.checked) {
      this.listaProductos[index].Seleccionado = true;
    } else {
      this.listaProductos[index].Seleccionado = false;
    }
  }

  enviarProductos() {
    this.productosRegresar.emit(this.listaProductos);
    this.cerrar.emit(false);
  }

  EliminarProducto(id_pro: number) {
    // this.sFacturas.eliminarProducto(id_pro).subscribe(
    //   elimino => {
    //     if (elimino) {
    //       alert('Producto eliminado con exito')
    //       this.ngOnInit();
    //     } else {
    //       alert('No se pudo eliminar al producto porque esta referenciado en una factura')
    //     }
    //   },
    //   error => {
    //     console.log(error)
    //     alert('Ocurrio un problema inesperado')
    //   }
    // )
  }

}
