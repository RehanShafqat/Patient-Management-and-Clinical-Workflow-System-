// src/app/layout/layout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth/auth.service';
import { AuthUser } from '../core/models/auth.model';
import { NAV_ITEMS, NavItem } from './navbar.config';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  currentUser: AuthUser | null = null;
  navItems: NavItem[] = [];
  sidebarOpen = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Load nav items based on role
    if (this.currentUser?.role) {
      this.navItems = NAV_ITEMS[this.currentUser.role] || [];
    }
  }

  get userFullName(): string {
    return `${this.currentUser?.first_name} ${this.currentUser?.last_name}`;
  }

  get userRoleLabel(): string {
    const labels: Record<string, string> = {
      admin: 'Administrator',
      doctor: 'Doctor',
      fdo: 'Front Desk Officer',
    };
    return labels[this.currentUser?.role || ''] || '';
  }

  get roleColor(): string {
    const colors: Record<string, string> = {
      admin: 'badge-primary',
      doctor: 'badge-success',
      fdo: 'badge-warning',
    };
    return colors[this.currentUser?.role || ''] || 'badge-neutral';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
