import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button 
      [type]="type"
      (click)="onClick.emit($event)"
      [disabled]="disabled || loading"
      class="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
      [ngClass]="[getSizeClasses(), getVariantClasses(), customClasses]">
      
      <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>

      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() variant: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' = 'primary';
    @Input() size: 'sm' | 'md' | 'lg' | 'full' = 'md';
    @Input() disabled = false;
    @Input() loading = false;
    @Input() customClasses = '';
    @Output() onClick = new EventEmitter<MouseEvent>();

    getSizeClasses() {
        switch (this.size) {
            case 'sm': return 'px-3 py-1.5 text-sm';
            case 'lg': return 'px-6 py-3 text-lg w-full md:w-auto';
            case 'full': return 'w-full px-4 py-2 text-base';
            default: return 'px-4 py-2 text-base';
        }
    }

    getVariantClasses() {
        switch (this.variant) {
            case 'primary':
                return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.6)] focus:ring-blue-500 border border-blue-400/30';
            case 'secondary':
                return 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-[0_4px_15px_rgba(236,72,153,0.4)] hover:shadow-[0_8px_25px_rgba(236,72,153,0.6)] focus:ring-pink-500 border border-pink-400/30';
            case 'danger':
                return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-[0_4px_15px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_25px_rgba(239,68,68,0.6)] focus:ring-red-500 border border-red-400/30';
            case 'outline':
                return 'bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-sm focus:ring-white/50 backdrop-filter shadow-lg';
            case 'ghost':
                return 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent shadow-none transform-none hover:transform-none';
            default:
                return '';
        }
    }
}
