import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div 
      class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
      [ngClass]="[customClasses, hoverEffect ? 'hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : '']"
    >
      <div *ngIf="title || subtitle" class="p-6 border-b border-white/5 relative z-10">
        <h3 *ngIf="title" class="text-xl font-bold text-white mb-1">{{ title }}</h3>
        <p *ngIf="subtitle" class="text-sm font-medium text-slate-400">{{ subtitle }}</p>
      </div>
      
      <div class="p-6 relative z-10" [ngClass]="bodyClasses">
        <ng-content></ng-content>
      </div>
      
      <div *ngIf="footer" class="p-6 bg-slate-900/50 border-t border-white/5 relative z-10 rounded-b-2xl">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() footer: boolean = false;
    @Input() customClasses: string = '';
    @Input() bodyClasses: string = '';
    @Input() hoverEffect: boolean = false;
}
