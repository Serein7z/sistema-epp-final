import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-box">
      <span class="loader-spin"></span>
      <p *ngIf="mensaje">{{ mensaje }}</p>
    </div>
  `,
  styles: [`
    .loader-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 48px 0;
      color: var(--text-dim);
      font-size: 13px;
    }
    .loader-spin {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 3px solid var(--border-soft);
      border-top-color: var(--accent);
      animation: spin 0.7s linear infinite;
    }
  `],
})
export class Loader {
  @Input() mensaje = 'Cargando datos...';
}
