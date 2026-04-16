import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { NAV_ITEMS, NavItem } from '../navbar.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, AsyncPipe],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @ViewChild('logoutConfirmModal')
  logoutConfirmModal?: ElementRef<HTMLDialogElement>;

  private authService = inject(AuthService);
  private router = inject(Router);
  themeService = inject(ThemeService);

  navItems: NavItem[] = [];
  currentUser$ = this.authService.currentUser$;
  isLoggingOut = false;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.navItems = NAV_ITEMS[user.role] || [];
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.currentTheme() === 'medflow-dark';
  }

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
    this.authService.logout().subscribe({
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
