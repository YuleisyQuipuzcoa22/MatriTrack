export interface HistorialMedicoDetalle {
  id_historialmedico: string;
  antecedente_medico: string | null; 
  alergia: string | null;             
  tipo_sangre: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  fecha_iniciohistorial: string;
}

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
  historial_medico: HistorialMedicoDetalle; 
}