import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURLAuth = environment.apiAuth;
  userLogin: string | undefined;
  nameKeyToken = 'USSER_TOKEN';
  constructor(private httpCliente: HttpClient) { }

  login(usuario:String, contrasenia:String){
    return this.httpCliente.post(`${this.apiURLAuth}/autenticacion`, { usuario, contrasenia });
  }

  saveToken(token:any){
    sessionStorage.setItem(this.nameKeyToken, token);
  }

  getToken(){
    const usserToken = sessionStorage.getItem(this.nameKeyToken);
    
    return usserToken;
  }

  decodeJwt(jwt:string){
    return jwtDecode<any>(jwt);
  }

  
}
