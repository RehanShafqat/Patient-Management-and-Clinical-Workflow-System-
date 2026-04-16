import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ThemeService } from '../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.currentTheme() === 'medflow-dark';
  }
}
