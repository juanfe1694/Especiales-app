
export interface LoginResponse{
    token?:string
  }

  export interface UserCredentialsFetch {
    usuario: string;
    clave: string;
  }

  export interface userCredentials {
    user: string | null; 
    password: string | null;
}

export interface userInfo {
  activo: boolean,
  celular: bigint,
  clave: string,
  nitEmpresa: bigint,
  nombres: string,
  apellidos: string,
  numeroContrato: bigint,
  numeroDocumento: bigint,
  roles: string[],
  tipoDocumento: string,
  urlImagenPerfil: string
}