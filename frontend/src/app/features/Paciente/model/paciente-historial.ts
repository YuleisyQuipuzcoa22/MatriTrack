import { HistorialMedico } from "../../HistorialMedico/model/historial-medico";


// Interfaz principal del Paciente
export interface PacienteData {
  id_paciente: string;
  dni: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  direccion: string;
  sexo: 'M' | 'F';
  telefono: string;
  correo_electronico: string;
  estado: 'A' | 'I';
  fecha_inhabilitacion: string | null;
  edad: number; 
  historial_medico: HistorialMedico; 
}