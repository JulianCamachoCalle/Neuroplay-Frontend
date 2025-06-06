export interface Ejercicio {
  id: number;
  terapiaId: number;
  terapiaNombre: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  repeticiones: number;
  duracionMinutos: number;
  nivelDificultad: string;
  videoUrl?: string;
  imagenUrl?: string;
}
