import { Pipe, PipeTransform } from '@angular/core';

// No es un simple 'uppercase': convierte el texto de estado en la clase CSS
// que define el color del badge en la tabla (verde = Nuevo, azul = En uso, etc).
@Pipe({ name: 'estadoClase', standalone: true })
export class EstadoClasePipe implements PipeTransform {
  transform(estado: string): string {
    const normalizado = (estado || '').toLowerCase();
    if (normalizado.includes('nuevo')) return 'badge-nuevo';
    if (normalizado.includes('uso')) return 'badge-en-uso';
    if (normalizado.includes('dañ') || normalizado.includes('dan')) return 'badge-danado';
    if (normalizado.includes('baja')) return 'badge-baja';
    return 'badge-default';
  }
}
