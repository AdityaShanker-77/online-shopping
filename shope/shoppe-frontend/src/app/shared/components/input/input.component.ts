import { Component, Input, Output, EventEmitter, forwardRef, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const INPUT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true
};

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [INPUT_VALUE_ACCESSOR],
  template: `
    <div class="flex flex-col gap-1 w-full" [class]="wrapperClass">
      <label *ngIf="label" [for]="id" class="text-sm font-medium text-slate-300 ml-1">{{ label }} <span *ngIf="required" class="text-red-400">*</span></label>
      <input 
        [type]="type" 
        [id]="id"
        [name]="name"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        [(ngModel)]="value"
        (ngModelChange)="onValueChange($event)"
        class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm shadow-inner"
        [ngClass]="{'border-red-500 focus:border-red-500 focus:ring-red-500/20': error}"
      >
      <span *ngIf="error" class="text-xs text-red-400 mt-1 ml-1 font-medium">{{ error }}</span>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() id: string = Math.random().toString(36).substring(7);
  @Input() name: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() value: any = '';
  @Input() error: string | null = null;
  @Input() wrapperClass: string = '';

  @Output() valueChange = new EventEmitter<any>();

  onChange: any = () => { };
  onTouch: any = () => { };

  onValueChange(val: any) {
    this.value = val;
    this.valueChange.emit(val);
    this.onChange(val);
    this.onTouch();
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

