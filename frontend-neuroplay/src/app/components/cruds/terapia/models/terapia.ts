export interface Terapia {
  id: number;
  pacienteId: number;
  terapeutaId: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: string;
  paciente?: {
    id: number;
    nombre: string;
    apellido: string;
    usuario?: {
      id: number;
      nombre: string;
      apellido: string;
    };
  };
  terapeuta?: {
    id: number;
    nombre: string;
    apellido: string;
    usuario?: {
      id: number;
      nombre: string;
      apellido: string;
    };
  };
}
