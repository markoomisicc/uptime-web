import { AfterViewInit, Component, ElementRef, OnDestroy, viewChild } from '@angular/core';

interface Ping {
  x: number;
  y: number;
  color: string;
  start: number;
}

const SPACING = 36;
const DOT_RADIUS = 1.2;
const PING_RADIUS = 26;
const PING_DURATION = 2600;
const PING_INTERVAL = 200;

@Component({
  selector: 'app-status-backdrop',
  template: '<canvas #canvas aria-hidden="true"></canvas>',
  styleUrl: './status-backdrop.scss',
})
export class StatusBackdrop implements AfterViewInit, OnDestroy {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx!: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private cols = 0;
  private rows = 0;
  private pings: Ping[] = [];
  private lastPing = 0;
  private frame = 0;
  private resizeObserver?: ResizeObserver;
  private colors = { dot: '', up: '', warn: '', down: '' };

  private readonly reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;

    const styles = getComputedStyle(canvas);
    this.colors = {
      dot: styles.getPropertyValue('--color-line').trim(),
      up: styles.getPropertyValue('--color-up').trim(),
      warn: styles.getPropertyValue('--color-warn').trim(),
      down: styles.getPropertyValue('--color-down').trim(),
    };

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);

    if (!this.reducedMotion) {
      this.frame = requestAnimationFrame((time) => this.tick(time));
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
  }

  private resize(): void {
    const canvas = this.canvasRef().nativeElement;
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();

    this.width = width;
    this.height = height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    this.cols = Math.ceil(width / SPACING);
    this.rows = Math.ceil(height / SPACING);
    this.pings = [];

    this.draw(performance.now());
  }

  private tick(now: number): void {
    if (now - this.lastPing > PING_INTERVAL) {
      this.lastPing = now;
      const [x, y] = this.dot(
        Math.floor(Math.random() * this.cols),
        Math.floor(Math.random() * this.rows),
      );
      const roll = Math.random();
      this.pings.push({
        x,
        y,
        color: roll < 0.8 ? this.colors.up : roll < 0.95 ? this.colors.warn : this.colors.down,
        start: now,
      });
    }

    this.pings = this.pings.filter((ping) => now - ping.start < PING_DURATION);
    this.draw(now);

    this.frame = requestAnimationFrame((time) => this.tick(time));
  }

  private draw(now: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.globalAlpha = 1;
    ctx.fillStyle = this.colors.dot;
    ctx.beginPath();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const [x, y] = this.dot(col, row);
        ctx.moveTo(x + DOT_RADIUS, y);
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
      }
    }
    ctx.fill();

    ctx.lineWidth = 1.5;
    for (const ping of this.pings) {
      const progress = (now - ping.start) / PING_DURATION;
      const eased = 1 - Math.pow(1 - progress, 3);

      ctx.globalAlpha = 1 - progress;
      ctx.strokeStyle = ping.color;
      ctx.fillStyle = ping.color;

      ctx.beginPath();
      ctx.arc(ping.x, ping.y, PING_RADIUS * eased, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ping.x, ping.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  private dot(col: number, row: number): [number, number] {
    return [col * SPACING + SPACING / 2, row * SPACING + SPACING / 2];
  }
}