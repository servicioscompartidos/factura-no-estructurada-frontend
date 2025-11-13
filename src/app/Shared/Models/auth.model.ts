export interface ResponseAuth {
  cambio: boolean
  codigo: string
  roles: Roles
  usuario: string
  id: number
  nombre: string
  sub: string
  iat: number
  exp: number
}

export interface Roles {
  "Administrador Tienda": string
  "Usuarios-tienda": string
  "VN Administrador Tienda": string
  "EB Administrador Tienda": string
}