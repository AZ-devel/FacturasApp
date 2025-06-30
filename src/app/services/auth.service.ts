import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, getIdToken, signOut, createUserWithEmailAndPassword, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { SFacturasService } from './sfacturas.service';
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private router: Router, private cookies: CookieService, private auth: Auth, private Sfacturas: SFacturasService) { };
    
    register(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }
    token: string = '';
    login(email: string, contraseña: string) {
        signInWithEmailAndPassword(this.auth, email, contraseña).then(
            correcto => {
                this.Sfacturas.establecerEmail(email)
                getIdToken(correcto.user).then(
                    token => {
                        this.token = token;
                        this.cookies.set("token", this.token);
                        this.router.navigate(['/home']);
                    }
                );
            }
        )
    }

    cambiarContrasena(email: string, contraseñaActual: string, nuevaContrasena: string) {
        const credential = EmailAuthProvider.credential(email, contraseñaActual);
        if (this.auth.currentUser) {
            const user = this.auth.currentUser;
            return reauthenticateWithCredential(user, credential)
                .then(
                    () => { updatePassword(user, nuevaContrasena); }
                )
                .catch(
                    error => {
                        console.log('Contraseña incorrecta');
                        return Promise.reject(new Error(error));
                    }
                )

        } else {
            return Promise.reject(new Error('No hay usuario autenticado.'));
        }
    }

    actualizarContraseña(nuevaContrasena: string) {
        const user = this.auth.currentUser;

        if (user) {
            return updatePassword(user, nuevaContrasena);
        } else {
            return Promise.reject(new Error('No hay usuario autenticado.'));
        }
    }



    getIdToken() {
        //return this.token;
        return this.cookies.get("token");
    }
    estaLogeado() {
        //return this.token;
        return this.cookies.get("token");
    }

    cerrarSesion() {
        signOut(this.auth).then(() => {
            this.token = '';
            this.cookies.set("token", this.token);
            this.router.navigate(['/']);
        })
    }



}
