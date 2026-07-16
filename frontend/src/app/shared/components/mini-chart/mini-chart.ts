import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-mini-chart',
  standalone: true,
  template: `
    <div class="chart-caja">
      <canvas #lienzo></canvas>
    </div>
  `,
  styles: [`
    .chart-caja {
      position: relative;
      width: 100%;
      height: 100%;
    }
  `],
})
export class MiniChart implements AfterViewInit, OnChanges, OnDestroy {
  @Input() tipo: 'bar' | 'doughnut' = 'bar';
  @Input() etiquetas: string[] = [];
  @Input() valores: number[] = [];
  @Input() colores: string[] = ['#2f7bf6', '#38d0c9', '#34d399', '#fbbf5c', '#f2637a'];

  @ViewChild('lienzo') lienzo!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngAfterViewInit(): void {
    this.dibujar();
  }

  ngOnChanges(cambios: SimpleChanges): void {
    if (!cambios['valores']?.firstChange) {
      this.dibujar();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private dibujar(): void {
    if (!this.lienzo) return;
    this.chart?.destroy();

    const config: ChartConfiguration = {
      type: this.tipo,
      data: {
        labels: this.etiquetas,
        datasets: [{
          data: this.valores,
          backgroundColor: this.colores,
          borderWidth: this.tipo === 'doughnut' ? 2 : 0,
          borderColor: '#171f2c',
          borderRadius: this.tipo === 'bar' ? 6 : 0,
          hoverOffset: this.tipo === 'doughnut' ? 6 : 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: this.tipo === 'doughnut',
            position: 'bottom',
            labels: { color: '#92a3ba', boxWidth: 10, font: { size: 11 } },
          },
        },
        scales: this.tipo === 'bar' ? {
          x: { ticks: { color: '#92a3ba', font: { size: 11 } }, grid: { display: false } },
          y: { ticks: { color: '#92a3ba', stepSize: 1 }, grid: { color: 'rgba(148,175,209,0.08)' }, beginAtZero: true },
        } : undefined,
      },
    };

    this.chart = new Chart(this.lienzo.nativeElement, config);
  }
}
