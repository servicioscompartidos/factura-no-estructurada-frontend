import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  apiURLAuth = environment.apiURL + '/facturacion-no-estructurada';

  constructor(private httpClient: HttpClient) { }

  sendInvoice(data:any){
    return this.httpClient.post(`${this.apiURLAuth}/obtener-informacion`, data);
  }
}
