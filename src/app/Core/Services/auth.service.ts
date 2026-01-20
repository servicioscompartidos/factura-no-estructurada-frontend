import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURLAuth = environment.apiAuth;
  apiURL = environment.apiURL;
  userLogin: string | undefined;
  userInfoLogin: string | undefined;
  nameKeyToken = 'USSER_TOKEN';
  nameKeyInfo = 'USSER_INFO';

  constructor(private httpCliente: HttpClient) { }

  login(usuario:String, contrasenia:String){
    return this.httpCliente.post(`${this.apiURLAuth}/autenticacion`, { usuario, contrasenia });
  }

  getInfoUser(idUser:number){
    return this.httpCliente.get(`${this.apiURL}/user/info/${idUser}`);
  }

  saveToken(token:any){
    sessionStorage.setItem(this.nameKeyToken, token);
  }

  saveInfoUser(token:any){
    sessionStorage.setItem(this.nameKeyInfo, token);
  }

  getToken(){
    const usserToken = sessionStorage.getItem(this.nameKeyToken);
    
    return usserToken;
  }
  
  getInfoSessionUser(){
    const infoSession = sessionStorage.getItem(this.nameKeyInfo);
    
    return infoSession;

  }

  decodeJwt(jwt:string){
    return jwtDecode<any>(jwt);
  }

  validSession(){
    if(this.getToken()){
      const token: any = jwtDecode(this.getToken() || '');

      if(token && token.exp && Date.now() < token.exp*1000 ){
        return true;
      }else{
        sessionStorage.clear();
      }
    }

    return false;
  }
}
