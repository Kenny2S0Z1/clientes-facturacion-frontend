 interface JwtPayload {
  sub: string; // normalmente el username
  authorities?: string[]; // depende de cómo el backend envíe los roles
  roles?: string[];       // a veces los roles vienen en "roles"
  exp?: number;           // fecha de expiración (timestamp)
}

export interface JwtPayloadSpringBoot extends JwtPayload{
      nombre?:string;
      apellido?:string;
}