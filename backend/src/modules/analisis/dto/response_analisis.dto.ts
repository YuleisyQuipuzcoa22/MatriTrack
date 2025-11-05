import { Estado } from "src/enums/Estado";

export class ResponseAnalisisDto {
  id_analisis: string;
  nombre_analisis: string;
  descripcion_analisis: string | null;
  estado: Estado;
}
