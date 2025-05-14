export interface Terapeuta {
  id: number;
  especialidad: string;
  licencia: string;
  biografia: string;
  usuarioId: number;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
  };
}
