// Coincide con la forma de Casco, Guante, Lente, Mascarilla y Zapato en el backend.
// Los dos campos "variables" (marca/talla, tipo/color, etc.) se guardan bajo el mismo
// objeto porque el backend los serializa así; el resto de la app los referencia
// dinámicamente a través de ResourceConfig.campos.
export interface EppItem {
  id?: number;
  estado: string;
  observacion: string;
  [campoExtra: string]: string | number | undefined;
}

export type EstadoEpp = 'Nuevo' | 'En uso' | 'Dañado' | 'De baja';

export const ESTADOS_EPP: EstadoEpp[] = ['Nuevo', 'En uso', 'Dañado', 'De baja'];
