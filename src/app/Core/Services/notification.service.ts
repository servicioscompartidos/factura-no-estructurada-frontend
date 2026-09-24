import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Response } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /**
   * Los avisos de exito salen como toast para no bloquear la pantalla en cada
   * peticion. Ponlo en false si los prefieres como modal, igual que los errores.
   */
  private readonly successAsToast = true;

  private readonly toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  notify(response: Response){
    if(response.success){
      this.success(response);
    }else{
      this.error(response);
    }
  }

  success(response: Response){
    if(this.successAsToast){
      this.toast.fire({
        icon: 'success',
        title: response.title,
        text: response.message
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: response.title,
      text: response.message,
      timer: 4000,
      showConfirmButton: false
    });
  }

  error(response: Response){
    Swal.fire({
      icon: 'error',
      title: response.title,
      text: response.message
    });
  }

  /** Devuelve el cuerpo si cumple el contrato; null si la respuesta es de otra forma. */
  fromHttpResponse(response: HttpResponse<unknown>): Response | null {
    return this.isApiResponse(response.body) ? response.body : null;
  }

  /** Normaliza cualquier fallo HTTP al contrato, incluidos los que no vienen del backend. */
  fromHttpError(error: HttpErrorResponse): Response {
    if(this.isApiResponse(error.error)){
      return error.error;
    }

    if(error.status === 0){
      return {
        statusCode: 0,
        title: 'Sin conexion',
        message: 'No se pudo contactar al servidor. Revise su conexion e intentelo nuevamente.',
        success: false,
        data: null
      };
    }

    return {
      statusCode: error.status,
      title: 'Error inesperado',
      message: typeof error.error === 'string' && !!error.error ? error.error : error.message,
      success: false,
      data: null
    };
  }

  private isApiResponse(body: unknown): body is Response {
    return !!body
      && typeof body === 'object'
      && typeof (body as Response).title === 'string'
      && typeof (body as Response).message === 'string'
      && typeof (body as Response).success === 'boolean';
  }
}
