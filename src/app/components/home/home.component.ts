import { Component, OnInit } from '@angular/core';
import { SFacturasService } from '../../services/sfacturas.service';
import { Usuarios, DetOrdenes, Productos, ProductosOrden, Orden } from '../../Models/Entities.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  listaProductos: Productos[] = []
  listaProductosOrden: ProductosOrden[] = [];
  total: number = 0;
  buscarClientes: boolean = false;
  buscarProductos: boolean = false;
  cliente?: Usuarios;
  numeroOrden: number = 0
  fechaActual = new Date();
  orden = new Orden(0, 0, 0, 'Abierta');

  dia = this.fechaActual.getDate();
  mes = this.fechaActual.getMonth() + 1; // Los meses en JavaScript son 0-indexados
  anio = this.fechaActual.getFullYear();

  fechaFormateada = `${this.dia}/${this.mes}/${this.anio}`;
  constructor(private sFacturas: SFacturasService, private ruta: Router) { }

  ngOnInit(): void {
    this.sFacturas.retornarProductos()
      .subscribe(
        respuesta => {
          if (respuesta.esCorrecto) {
            this.listaProductos = Object.values(respuesta.valor).filter(x => x.stock > 0);
          } else {
            console.log(respuesta.mensaje);
          }
        }
      )
    this.sFacturas.listarOrdenes()
      .subscribe(
        respuesta => {
          if (respuesta.esCorrecto) {
            if (Object.values(respuesta.valor).length > 0) {
              this.numeroOrden = Object.values(respuesta.valor).reduce((max, factura) => (factura.ordenID > max ? factura.ordenID : max), Object.values(respuesta.valor)[0].ordenID);
            } else {
              this.numeroOrden = 1;
            }
          } else {
            console.log(respuesta.mensaje);
          }
        }
      )
  }
  actualizarOrdenVenta(evento: Event, id: number) {
    const inputElement = evento.target as HTMLInputElement;
    if (inputElement.checked) {
      this.listaProductos.filter(x => x.Seleccionado).forEach(producto => {
        if (!this.listaProductosOrden.find(x => x.Id_Pro == producto.idProducto)) {
          this.listaProductosOrden.push(new ProductosOrden(producto.idProducto, producto.nombre, producto.precio, producto.stock, 1));
        }
      });
    } else {
      this.eliminarProductoOrden(id);
    }
    this.actualizarTotal();
    //this.listaProductosOrden=[];        
  }
  eliminarProductoOrden(id: number) {
    const index = this.listaProductosOrden.findIndex(producto => producto.Id_Pro === id);
    const indexProducts = this.listaProductos.findIndex(producto => producto.idProducto === id);
    this.listaProductosOrden.splice(index, 1);
    this.listaProductos[indexProducts].Seleccionado = false;
    this.listaProductosOrden = [...this.listaProductosOrden];

    this.actualizarTotal();
  }
  actualizarSubtotal(idProducto: number) {
    var indice;
    indice = this.listaProductosOrden.findIndex(x => x.Id_Pro == idProducto)
    this.controlarProductoStock(indice);
    this.listaProductosOrden[indice].Subtotal = this.listaProductosOrden[indice].Cantidad * this.listaProductosOrden[indice].Precio
    this.actualizarTotal();
  }

  actualizarTotal() {
    this.total = 0;
    this.listaProductosOrden.forEach(sub => {
      this.total += sub.Subtotal
    });
  }

  controlarProductoStock(indiceProducto: number) {
    if (this.listaProductosOrden[indiceProducto].Cantidad > this.listaProductosOrden[indiceProducto].Stock) {
      this.listaProductosOrden[indiceProducto].Cantidad = 1
      alert('Por favor ingrese una cantidad de acorde al stock')
    }
    if (this.listaProductosOrden[indiceProducto].Cantidad < 1) {
      this.listaProductosOrden[indiceProducto].Cantidad = 1;
      alert('Ingrese un numero mayor a cero')
    }
  }

  actualizarProductosFiltrados(listaProd: Productos[]) {
    this.listaProductos = listaProd
    this.listaProductos.filter(x => x.Seleccionado == true).forEach(
      producto => {
        var indice = this.listaProductosOrden.findIndex(x => x.Id_Pro == producto.idProducto)
        if (indice == -1) {
          this.listaProductosOrden.push(new ProductosOrden(producto.idProducto, producto.nombre, producto.precio, producto.stock, 1));
        }
      }
    );
    if (this.listaProductos.filter(x => x.Seleccionado == true).length != this.listaProductosOrden.length) {
      this.listaProductosOrden.forEach(productoOrden => {
        var indice = this.listaProductos.filter(x => x.Seleccionado == true).findIndex(x => x.idProducto == productoOrden.Id_Pro)
        if (indice == -1) {
          var indiceAux = this.listaProductosOrden.findIndex(x => x.Id_Pro == productoOrden.Id_Pro)
          this.listaProductosOrden.splice(indiceAux, 1);
          this.listaProductosOrden = [...this.listaProductosOrden];
        }
      });
    }
    this.actualizarTotal();
  }

  IrFactura() {
    try {
      if (this.cliente) {
        if (this.listaProductosOrden.length == 0) {
          alert('Minimo debe existir un producto para realizar la factura')
        } else {
          var listaDetFacturas: DetOrdenes[] = []
          listaDetFacturas = this.listaProductosOrden.map(orden =>
            new DetOrdenes(0, 0, orden.Id_Pro, orden.Cantidad, orden.Subtotal));
          this.orden = new Orden(0, this.cliente.usuarioID, this.total, 'Cerrada', listaDetFacturas);
          this.sFacturas.retornarProductosSinImagenes().subscribe(
            productosbuscados=>{
              let validador:boolean=false
              this.orden.listaOrdenes.forEach(listaOrden=>{
                let findProduct = Object.values(productosbuscados.valor).find(x=>x.idProducto==listaOrden.productoID)
                alert(findProduct.stock)
                if (findProduct.stock<listaOrden.cantidad) {
                  validador=true;
                  alert('Stock no suficiente')
                  return 
                }                
              }
            )
            if (!validador) {
              this.sFacturas.crearOrden(this.orden).subscribe(
                respuesta => {
                  if (respuesta.esCorrecto) {
                    this.ruta.navigate(['/factura/' + respuesta.valor])
                  }
                  else {
                    alert('La factura no fue creada, se ha encontrado un error')
                    console.log(respuesta.mensaje);
                  }
                },
                error => {
                  alert('Factura no realizada, intentelo mas tarde')
                  console.log(error)
                }
              );
            }
            }
          )
        }
      } else {
        alert('Por favor escoja un cliente para hacer la factura')
      }
    } catch (error) {
      alert('Ha ocurrido un error al generar la factura')
      console.log(error);
    }
  }

  GuardarDetalles(id_fac: number) {

    var listaDetFacturas: DetOrdenes[] = []
    this.listaProductosOrden.forEach(orden => {
      listaDetFacturas.push(new DetOrdenes(0, id_fac, orden.Id_Pro, orden.Cantidad, orden.Subtotal))
    }
    );
    this.sFacturas.InsertarProductos(listaDetFacturas).subscribe(
      estado => {
        if (estado < 0) {
          alert('El stock de un producto se ha acabado antes de ingresar la factura, por lo cual se ha cancelado la factura');
          console.log('Estado al crear los detalles factura: ' + estado)
          this.BorrarFactura(id_fac);
          this.ngOnInit()
          this.listaProductosOrden = []
        } else {
          this.ruta.navigate(['/factura/' + id_fac])
        }
      }
    )
  }

  BorrarFactura(id_fac: number) {
    // this.sFacturas.EliminarFactura(id_fac).subscribe(
    //   elimino => {
    //     if (elimino) {
    //       console.log('Se ha eliminado con exito')
    //     } else
    //       console.log('No se ha podido eliminar la factura tras el error')
    //   }
    // )
  }

  validarInput(event: KeyboardEvent, stock: number, orden: ProductosOrden) {
    if (!isNaN(parseInt(event.key))) {
      // var auxCantidad= parseInt(orden.Cantidad.toString()+event.key)      
      // if (parseInt(event.key)==0 ) {
      //   event.preventDefault();     
      // }
    } else {
      event.preventDefault();
    }

  }

}
