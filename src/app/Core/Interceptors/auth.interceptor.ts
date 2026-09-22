import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { NotificationService } from '../Services/notification.service';
import { SKIP_ERROR_NOTIFICATION, SKIP_SUCCESS_NOTIFICATION } from './http-context.tokens';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if(request.url.includes('/servicios-compartidos/emisor-retenciones')){

      return next.handle(request);
    }

    const token = this.authService.getToken();

    // Sin token no se manda el header: antes viajaba la cadena "null" y el
    // backend respondia 500 en vez de 401.
    const authReq = token
      ? request.clone({ headers: request.headers.set('apiKey', token) })
      : request;

    const avisarExito = !request.context.get(SKIP_SUCCESS_NOTIFICATION);
    const avisarError = !request.context.get(SKIP_ERROR_NOTIFICATION);

    return next.handle(authReq).pipe(

      tap(event => {
        if(!avisarExito || !(event instanceof HttpResponse)) return;

        const response = this.notification.fromHttpResponse(event);

        if(!!response) this.notification.success(response);
      }),

      catchError((error: HttpErrorResponse) => {

        if(avisarError){
          this.notification.error(this.notification.fromHttpError(error));
        }

        if(error.status === 401){
          sessionStorage.clear();
          this.router.navigate(['']);
        }

        return throwError(() => error);
      })
    );
  }
}
