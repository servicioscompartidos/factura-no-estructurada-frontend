import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SKIP_SUCCESS_NOTIFICATION = new HttpContextToken<boolean>(() => false);
export const SKIP_ERROR_NOTIFICATION = new HttpContextToken<boolean>(() => false);


export const sinAviso = () => ({
  context: new HttpContext()
    .set(SKIP_SUCCESS_NOTIFICATION, true)
    .set(SKIP_ERROR_NOTIFICATION, true)
});


export const sinAvisoExito = () => ({
  context: new HttpContext().set(SKIP_SUCCESS_NOTIFICATION, true)
});


export const sinAvisoError = () => ({
  context: new HttpContext().set(SKIP_ERROR_NOTIFICATION, true)
});
