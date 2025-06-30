import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrarClienteComponent } from './components/registrar-cliente/registrar-cliente.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscarClienteComponent } from './components/buscar-cliente/buscar-cliente.component';
import { BuscarProductosComponent } from './components/buscar-productos/buscar-productos.component';
import { FacturaComponent } from './components/factura/factura.component';
import { VerFacturasComponent } from './components/ver-facturas/ver-facturas.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CookieService } from 'ngx-cookie-service';
import { LoginGuardian } from './components/login/login-guardian';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { ProductosComponent } from './components/productos/productos.component';
import { EditarImagenesComponent } from './components/editar-imagenes/editar-imagenes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ConfirmarContraseniaComponent } from './components/confirmar-contrasenia/confirmar-contrasenia.component';
import { LogsComponent } from './components/logs/logs.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrarClienteComponent,
    HomeComponent,
    BuscarClienteComponent,
    BuscarProductosComponent,
    FacturaComponent,
    VerFacturasComponent,    
    ProductosComponent,
    EditarImagenesComponent,
    UsuariosComponent,
    PerfilComponent,
    ConfirmarContraseniaComponent,
    LogsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [
    provideClientHydration(),
    CookieService,
    LoginGuardian,    
    provideFirebaseApp(() => initializeApp({ "projectId": "facturacion-app-5ae81", 
      "appId": "1:895840865278:web:22c83102c32408b4758eaf", "databaseURL": "https://facturacion-app-5ae81-default-rtdb.firebaseio.com", 
      "storageBucket": "facturacion-app-5ae81.appspot.com", "apiKey": "AIzaSyAcC99oteb87cRnrNs11aRI_EUOLIWrFzE", 
      "authDomain": "facturacion-app-5ae81.firebaseapp.com", "messagingSenderId": "895840865278", 
      "measurementId": "G-R9PQ8Y0H3F" })),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
