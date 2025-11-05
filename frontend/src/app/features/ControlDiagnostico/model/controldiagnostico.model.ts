export interface ControlDiagnostico {
    id_control_diagnostico: string;
    id_programadiagnostico: string;
    id_usuario: string;
    fecha_controldiagnostico: string; // ISO Date
    fecha_modificacion: string | null; // ISO Date
    semana_gestacion: number;
    peso : number;
    talla : number;
    presion_arterial: string;
    altura_uterina: number;
    fcf: number | null;
    observacion: string | null;
    recomendacion: string | null;

    usuario?: {
        nombre: string;
        apellido: string;
    };

}


export interface CreateControlDiagnosticoDto {
    semana_gestacion: number;
    peso : number;
    talla : number;
    presion_arterial: string;
    altura_uterina: number;
    fcf?: number;
    observacion?: string;
    recomendacion?: string;
}
export type UpdateControlDiagnosticoDto = Partial<CreateControlDiagnosticoDto>;
