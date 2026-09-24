import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { sinAviso, sinAvisoExito } from '../Interceptors/http-context.tokens';
import { Response } from '../interfaces/response.interface';
import { Model, Supplier } from '../../Shared/Models/home.model';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  apiURLAuth = environment.apiURL + '/facturacion-no-estructurada';

  constructor(private httpClient: HttpClient) { }

  sendInvoice(data:any){
    return this.httpClient.post<Response<null>>(`${this.apiURLAuth}/obtener-informacion`, data, sinAviso());
  }

  getSuppliers(id:number, company:number){
    return this.httpClient.get<Response<Supplier[]>> (`${this.apiURLAuth}/proveedores/${id}/${company}`, sinAvisoExito());
  }

  getModels(id:number){
   return this.httpClient.get<Response<Model[]>>(`${this.apiURLAuth}/models/${id}`, sinAvisoExito());
  }

}
