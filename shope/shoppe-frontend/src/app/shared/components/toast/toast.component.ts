import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { LucideAngularModule, CheckCircle, XCircle, Info, X } from 'lucide-angular';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="fixed top-24 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      <div *ngFor="let toast of activeToasts; let i = index" 
           class="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 pointer-events-auto transform transition-all duration-300 translate-x-0"
           [ngClass]="{
             'border-green-500/50 bg-green-500/10': toast.type === 'success',
             'border-red-500/50 bg-red-500/10': toast.type === 'error',
             'border-blue-500/50 bg-blue-500/10': toast.type === 'info'
           }">
        
        <lucide-icon *ngIf="toast.type === 'success'" name="check-circle" class="w-5 h-5 text-green-400"></lucide-icon>
        <lucide-icon *ngIf="toast.type === 'error'" name="x-circle" class="w-5 h-5 text-red-400"></lucide-icon>
        <lucide-icon *ngIf="toast.type === 'info'" name="info" class="w-5 h-5 text-blue-400"></lucide-icon>

        <span class="text-white font-medium text-sm flex-1">{{ toast.message }}</span>

        <button (click)="removeToast(i)" class="text-gray-400 hover:text-white transition-colors">
          <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent implements OnInit, OnDestroy {
    activeToasts: ToastMessage[] = [];
    private subscription!: Subscription;

    constructor(private toastService: ToastService) { }

    ngOnInit() {
        this.subscription = this.toastService.toast$.subscribe(toast => {
            this.activeToasts.push(toast);
            setTimeout(() => {
                this.removeToast(this.activeToasts.indexOf(toast));
            }, toast.duration);
        });
    }

    removeToast(index: number) {
        if (index > -1 && index < this.activeToasts.length) {
            this.activeToasts.splice(index, 1);
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
