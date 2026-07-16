import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecursoConfig } from '../../core/models/recurso-config';
import { EppItem, ESTADOS_EPP } from '../../core/models/epp-item.model';
import { EppService } from '../../core/services/epp.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-recurso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recurso-form.html',
  styleUrl: './recurso-form.scss',
})
export class RecursoForm implements OnChanges {
  @Input({ required: true }) config!: RecursoConfig;
  @Input() abierto = false;
  @Input() itemEditando: EppItem | null = null;

  // Comunicación hijo -> padre: la lista se entera de que hay que refrescar o cerrar el panel.
  @Output() guardado = new EventEmitter<EppItem>();
  @Output() cerrado = new EventEmitter<void>();

  estados = ESTADOS_EPP;
  guardando = false;
  form!: FormGroup;

  constructor(private fb: FormBuilder, private epp: EppService, private toast: ToastService) {}

  ngOnChanges(cambios: SimpleChanges): void {
    if ((cambios['itemEditando'] || cambios['config']) && this.config) {
      this.construirFormulario();
    }
  }

  get esEdicion(): boolean {
    return !!this.itemEditando?.id;
  }

  private construirFormulario(): void {
    const grupo: Record<string, any> = {
      estado: [this.itemEditando?.estado ?? this.estados[0], Validators.required],
      observacion: [this.itemEditando?.observacion ?? '', [Validators.required, Validators.maxLength(140)]],
    };

    for (const campo of this.config.campos) {
      const valorPrevio = this.itemEditando?.[campo.key] ?? '';
      grupo[campo.key] = [
        valorPrevio,
        campo.tipo === 'number' ? [Validators.required, Validators.min(1)] : Validators.required,
      ];
    }

    this.form = this.fb.group(grupo);
  }

  cerrar(): void {
    this.cerrado.emit();
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const valores = this.form.value as EppItem;

    const peticion = this.esEdicion
      ? this.epp.actualizar(this.config.path, this.itemEditando!.id!, valores)
      : this.epp.crear(this.config.path, valores);

    peticion.subscribe({
      next: item => {
        this.guardando = false;
        this.toast.exito(this.esEdicion ? `${this.config.singular} actualizado` : `${this.config.singular} agregado`);
        this.guardado.emit(item);
      },
      error: () => {
        this.guardando = false;
        this.toast.error('No se pudo guardar. Verifica el backend.');
      },
    });
  }
}
