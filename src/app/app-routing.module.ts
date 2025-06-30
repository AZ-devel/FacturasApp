import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrarClienteComponent } from './components/registrar-cliente/registrar-cliente.component';
import { HomeComponent } from './components/home/home.component';
import { FacturaComponent } from './components/factura/factura.component';
import { VerFacturasComponent } from './components/ver-facturas/ver-facturas.component';
import { LoginGuardian } from './components/login/login-guardian';
import { ProductosComponent } from './components/productos/productos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LogsComponent } from './components/logs/logs.component';

const routes: Routes = [
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'login', component: LoginComponent, pathMatch:'full'},
  {path:'registrarCliente', component: RegistrarClienteComponent, pathMatch:'full'},
  {path:'home', component: HomeComponent, pathMatch:'full', canActivate:[LoginGuardian]},
  {path:'factura/:id', component: FacturaComponent, pathMatch:'full', canActivate:[LoginGuardian]},
  {path:'verFacturas', component: VerFacturasComponent, pathMatch:'full', canActivate:[LoginGuardian]},
  {path:'productos', component: ProductosComponent, pathMatch:'full', canActivate:[LoginGuardian]},
  {path:'usuarios', component: UsuariosComponent, pathMatch:'full', canActivate:[LoginGuardian]},
  {path:'perfil', component: PerfilComponent, pathMatch:'full', canActivate:[LoginGuardian]},
  {path:'logs', component: LogsComponent, pathMatch:'full', canActivate:[LoginGuardian]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
