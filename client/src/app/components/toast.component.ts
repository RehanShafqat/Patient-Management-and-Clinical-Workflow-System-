import { Component, inject } from '@angular/core';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast toast-top toast-end z-50">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="alert alert-{{
            toast.type
          }} flex justify-between gap-4 min-w-64"
        >
          <span>{{ toast.message }}</span>
          <button
            class="btn btn-ghost btn-xs"
            (click)="toastService.remove(toast.id)"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);
}
