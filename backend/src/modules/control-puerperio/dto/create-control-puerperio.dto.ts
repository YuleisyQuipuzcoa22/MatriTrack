export class CreateControlPuerperioDto {
  id_programapuerperio!: string;
  usuario_id_usuario!: string;
  peso!: number;
  talla!: number;
  presion_arterial!: string;
  involucion_uterina?: string;
  cicatrizacion?: string;
  estado_mamas_lactancia?: string;
  estado_emocional?: string;
  observacion?: string;
  recomendacion?: string;
}
