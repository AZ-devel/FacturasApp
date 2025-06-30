import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import {  Injectable } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Injectable()
export class LoginGuardian implements CanActivate{

    constructor(private authenticationService:AuthService, private router:Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(this.authenticationService.estaLogeado()){
            return true;
        }else{
            this.router.navigateByUrl('/login');
            return false;            
        }
    }

}