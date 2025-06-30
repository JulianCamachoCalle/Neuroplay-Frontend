export interface Usuario {
    id: number;
    rol: string;
    nombre: String;
    apellido: String;
    username: String;
    password?: String;
    fechaNacimiento?: String;
    genero?: String;
    telefono?: String;
    fechaRegistro?: String;
    avatar?: String;
    estado?: String
}
