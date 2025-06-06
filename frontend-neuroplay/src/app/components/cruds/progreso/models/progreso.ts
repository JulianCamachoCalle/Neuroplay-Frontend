export interface Progreso {
  id: number;
  pacienteId: number;
  nombrePaciente: string;
  fecha: Date;
  fuerza: number;
  movilidad: number;
  detalle: number;
  notas?: string;
}
