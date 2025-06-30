import { Component, OnInit } from '@angular/core';
import { Productos } from '../../Models/Entities.model';
import { SFacturasService } from '../../services/sfacturas.service';
import { error } from 'console';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  producto: Productos = new Productos(0, '', 1, 1)
  productoAux: any[] = []
  productos: Productos[] = []
  listaProductosFiltrados: Productos[] = []
  abrirImagenes: boolean = false;
  estaCreando: boolean = true;
  formularioValido: boolean = false
  filtro: string = ''
  p: number = 1;
  constructor(private factura: SFacturasService) { }

  ngOnInit(): void {
    this.cambiaraCrear()
    this.factura.retornarProductos().subscribe(
      respuesta => {
        if (respuesta.esCorrecto) {
          this.productos = Object.values(respuesta.valor)
          this.listaProductosFiltrados = this.productos;
        } else {
          console.log(respuesta.mensaje)
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  BuscarProductos() {
    this.listaProductosFiltrados = this.productos.filter(x => x.idProducto == parseInt(this.filtro) || x.stock == parseInt(this.filtro)
      || x.nombre.toLowerCase().includes(this.filtro.toLowerCase()) || x.precio == parseFloat(this.filtro))

  }

  pasarDatos(producto: Productos) {
    if (!this.estaCreando) {
      console.log(this.productoAux)
      this.producto.nombre = this.productoAux[0]
      this.producto.precio = this.productoAux[1]
      this.producto.stock = this.productoAux[2]
      this.producto.descontinuado = this.productoAux[3]
      this.productoAux=[]
    }
    this.producto = producto
    this.productoAux.push(producto.nombre)
    this.productoAux.push(producto.precio)
    this.productoAux.push(producto.stock)
    this.productoAux.push(producto.descontinuado)
    this.estaCreando = false;

  }
  cambiaraCrear() {
    if (!this.estaCreando) {
      console.log(this.productoAux)
      this.producto.nombre = this.productoAux[0]
      this.producto.precio = this.productoAux[1]
      this.producto.stock = this.productoAux[2]
      this.producto.descontinuado = this.productoAux[3]
    }
    this.producto = new Productos(0, '', 1, 1);
    this.estaCreando = true;
  }

  guardarCambios() {
    if (!this.validarProducto()) {
      alert('El nombre del producto ya existe')
      return
    }
    if (this.estaCreando) {
      console.log('crearProducto', this.producto)
      this.factura.crearProducto(this.producto).subscribe(
        respuesta => {
          if (respuesta.esCorrecto) {
            alert('Producto guardado exitosamente')
            this.ngOnInit()
          } else {
            alert(respuesta.mensaje)
            console.log(respuesta.mensaje)
          }
        },
        error => {
          alert('No se ha guardado Por favor revise las alerta(s)')
          console.log(error)
        }
      )
    } else {
      this.producto.listaImgs.forEach(product => {
        product.idProPer=this.producto.idProducto
      });
      
      this.factura.actualizarProducto(this.producto).subscribe(
        respuesta => {
          if (respuesta.esCorrecto) {
            alert('Producto actualizado exitosamente')
            console.log(this.producto)
            this.ngOnInit()
          } else {
            alert('No se han guardado los cambios')
            console.log(respuesta.mensaje)
          }
        },
        error => {
          alert('No se ha actualizado revise las alerta(s)')
          console.log(error)
        }
      )
      this.productoAux=[]
    }

  }

  validarProducto(): boolean {
    let resultado = false;
    if (this.estaCreando) {
      resultado = this.productos.find(x => x.nombre.toLowerCase() == this.producto.nombre.toLowerCase()) ? false : true
    } else {
      resultado = this.productos.filter(x => x.idProducto != this.producto.idProducto).find(x => x.nombre.toLowerCase() == this.producto.nombre.toLowerCase()) ? false : true
    }
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }

  validarLength(texto: string, min: number) {
    let resultado = texto.length > 0 && texto.length < min ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }

  validarVacio(texto: number) {
    let resultado = texto <= 0 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }

  validarPrecio() {
    const regexPrecio = /^\d+(\.\d{1,2})?$/;
    let resultado = !regexPrecio.test(this.producto.precio.toString()) ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }
  validarSoloEnteros() {
    const regexEnteros = /^\d+$/;
    let resultado = !regexEnteros.test(this.producto.stock.toString()) ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }

  validarStock() {
    let resultado = this.producto.stock <= 0 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }

  validarRequeridos() {
    let resultado = this.producto.nombre.length == 0 || this.producto.precio.toString().length == 0 || this.producto.stock.toString().length == 0 ? false : true
    this.formularioValido = resultado
    return resultado
  }

}
