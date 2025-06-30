export class Usuarios {
    constructor(Id_Cli: number, Cedula: string, Nombre: string, Apellido: string, Ciudad: string, Telefono: string, fechaNacimiento: Date, email: string, password: string, rolID: number) {
        this.usuarioID = Id_Cli;
        this.cedula = Cedula;
        this.email = email;
        this.password = password;
        this.nombre = Nombre;
        this.apellido = Apellido;
        this.direccion = Ciudad;
        this.telefono = Telefono;
        this.fechaNacimiento = fechaNacimiento.toISOString();
        this.rolID = rolID;
        this.activo = true;
    }
    usuarioID: number = 0;
    email: string = "";
    password: string = "";
    cedula: string = ""
    nombre: string = "";
    apellido: string = "";
    direccion: string = "";
    telefono: string = "";
    fechaNacimiento: string='';
    rolID: number = 0;
    activo: boolean = true;
}
export class Productos {
    constructor(Id_Pro: number, Nombre: string, Precio: number, Stock: number) {
        this.idProducto = Id_Pro;
        this.nombre = Nombre;
        this.precio = Precio;
        this.stock = Stock;
    }
    idProducto: number = 0;
    nombre: string = "";
    precio: number = 0;
    stock: number = 0;
    Seleccionado: boolean = false;
    descontinuado:boolean=false;
    listaImgs:ImgsProductos[]=[]
}

export class Orden {
    constructor(id_Fac: number, id_Cli_Per: number, total: number, estado: string, listadoOrdenes?:DetOrdenes[]) {
        this.ordenID = id_Fac;
        this.clienteID = id_Cli_Per;
        this.fechaVenta = new Date(Date.now())
        this.totalVenta = total;
        this.estado = estado;
        this.listaOrdenes=listadoOrdenes?listadoOrdenes:[];
    }

    ordenID: number = 0;
    clienteID: number = 0;
    fechaVenta: Date;
    totalVenta: number = 0;
    estado: string = "";
    listaOrdenes:DetOrdenes[]=[]
}

export class DetOrdenes {
    constructor(id_Det_Fac: number, id_Fac_Per: number, id_Pro_Per: number, cantidad: number, subtotal: number) {
        this.detalleID = id_Det_Fac;
        this.ordenID = id_Fac_Per;
        this.productoID = id_Pro_Per;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }
    detalleID: number = 0;
    ordenID: number = 0;
    productoID: number = 0;
    cantidad: number = 0;
    subtotal: number = 0;
}
//Another Entities
export class ProductosOrden {
    constructor(Id_Pro: number, Nombre: string, Precio: number, Stock: number, Cantidad: number, subtotal?: number) {
        this.Id_Pro = Id_Pro;
        this.Nombre = Nombre;
        this.Nombre = Nombre;
        this.Precio = Precio;
        this.Stock = Stock;
        this.Cantidad = Cantidad;
        this.Subtotal = subtotal != undefined ? subtotal : this.Cantidad * this.Precio
    }
    Id_Pro: number = 0;
    Nombre: string = "";
    Precio: number = 0;
    Stock: number = 0;
    Cantidad: number = 0;
    Subtotal: number = this.Cantidad * this.Precio;
}

export class FacturaVista {
    constructor(Id_Fac: number, Fecha: string, Cliente: string, Monto: number) {
        this.Id_Fac = Id_Fac;
        this.Cliente = Cliente;
        this.Fecha = Fecha
        // this.Fecha='/Date(' + new Date(Fecha).getTime() + ')/';
        this.Monto = Monto;
    }
    Id_Fac: number = 0;
    Cliente: string = "";
    Monto: number = 0;
    Fecha: string = "";
}
export class Reporte {
    constructor() {

    }
    compraAlta: number = 0;
    compraBaja: number = 0
    clienteBaja: string = ""
    clienteAlta: string = ""
    ListaDescriptores: string[] = []
    ListaValores: number[] = []
}

export class Respuesta {
    constructor(esCorrecto: boolean, valor: Object, mensaje: string) {
        this.esCorrecto = esCorrecto;
        this.valor = valor;
        this.mensaje = mensaje;
    }
    esCorrecto: boolean = false
    valor: Object = new Object();
    mensaje: string = ""
}

export class ImgsProductos {
    constructor(idImagen: number, idProPer: number, imagen: string) {
        this.idImagen = idImagen;
        this.idProPer = idProPer;
        this.imagen = imagen;
    }
    idImagen: number = 0;
    idProPer: number = 0;    
    imagen: string = "";
}

export class Logs{
    tabla:string=''
    error:string=''
    fechaHora:Date=new Date(Date.now())
}
