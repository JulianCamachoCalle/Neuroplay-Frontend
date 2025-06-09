export interface Paciente {
  id: number;
  usuarioId: number;
  terapeutaId: number;
  terapeutaNombre: string;
  fechaAcv: Date;
  tipoAcv: string;
  antecedentes?: string;
  medicacionActual?: string;
  progresoTotal?: number;
  ejerciciosCompletados?: number;
  diasConsecutivos?: number;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
  };
}
