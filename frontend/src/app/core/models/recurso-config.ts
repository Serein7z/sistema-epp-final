export interface CampoConfig {
  key: string;
  label: string;
  tipo: 'text' | 'number';
  placeholder?: string;
}

export interface RecursoConfig {
  path: string;          // segmento de ruta y del endpoint del backend: /cascos, /guantes...
  titulo: string;        // plural, para menús y encabezados
  singular: string;      // "Casco", "Guante"...
  descripcion: string;
  campos: CampoConfig[]; // los 2 campos propios de cada recurso (además de estado/observación)
}

// Una sola fuente de verdad: de aquí sale el sidebar, las rutas dinámicas,
// las columnas de la tabla y los campos del formulario para cada uno de los 5 módulos.
export const RECURSOS: RecursoConfig[] = [
  {
    path: 'cascos',
    titulo: 'Cascos',
    singular: 'Casco',
    descripcion: 'Protección craneal',
    campos: [
      { key: 'marca', label: 'Marca', tipo: 'text', placeholder: 'Ej. 3M' },
      { key: 'talla', label: 'Talla', tipo: 'text', placeholder: 'S / M / L' },
    ],
  },
  {
    path: 'guantes',
    titulo: 'Guantes',
    singular: 'Guante',
    descripcion: 'Protección de manos',
    campos: [
      { key: 'material', label: 'Material', tipo: 'text', placeholder: 'Ej. Nitrilo' },
      { key: 'talla', label: 'Talla', tipo: 'text', placeholder: 'S / M / L' },
    ],
  },
  {
    path: 'lentes',
    titulo: 'Lentes',
    singular: 'Lente',
    descripcion: 'Protección visual',
    campos: [
      { key: 'tipo', label: 'Tipo', tipo: 'text', placeholder: 'Ej. Panorámico' },
      { key: 'color', label: 'Color', tipo: 'text', placeholder: 'Ej. Transparente' },
    ],
  },
  {
    path: 'mascarillas',
    titulo: 'Mascarillas',
    singular: 'Mascarilla',
    descripcion: 'Protección respiratoria',
    campos: [
      { key: 'tipo', label: 'Tipo', tipo: 'text', placeholder: 'Ej. N95' },
      { key: 'filtracion', label: 'Filtración', tipo: 'text', placeholder: 'Ej. 95%' },
    ],
  },
  {
    path: 'zapatos',
    titulo: 'Zapatos de seguridad',
    singular: 'Zapato',
    descripcion: 'Protección de pies',
    campos: [
      { key: 'marca', label: 'Marca', tipo: 'text', placeholder: 'Ej. Caterpillar' },
      { key: 'talla', label: 'Talla', tipo: 'number', placeholder: '42' },
    ],
  },
];

export function obtenerRecurso(path: string): RecursoConfig | undefined {
  return RECURSOS.find(r => r.path === path);
}
