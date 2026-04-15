import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  @ViewChild('logoutConfirmModal')
  logoutConfirmModal?: ElementRef<HTMLDialogElement>;

  auth = inject(AuthService);
  private router = inject(Router);
  isLoggingOut = false;
  currentUser$ = this.auth.currentUser$;

  openLogoutConfirm(): void {
    this.logoutConfirmModal?.nativeElement.showModal();
  }

  closeLogoutConfirm(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.logoutConfirmModal?.nativeElement.close();
  }

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    this.auth.logout().subscribe({
      next: () => {
        this.isLoggingOut = false;
        this.logoutConfirmModal?.nativeElement.close();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isLoggingOut = false;
        this.logoutConfirmModal?.nativeElement.close();
        this.router.navigate(['/login']);
      },
    });
  }
}
