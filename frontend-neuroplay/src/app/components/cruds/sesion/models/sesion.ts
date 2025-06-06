export interface Sesion {
  id: number;
  ejercicioId: number;
  nombreEjercicio: string;
  pacienteId: number;
  nombrePaciente: string;
  fecha: Date;
  duracionMinutos: number;
  rendimiento: string;
  completada: boolean;
  activacionMuscular: number;
  picoActivacion: number;
  repeticiones: number;
  observaciones?: string;
}
