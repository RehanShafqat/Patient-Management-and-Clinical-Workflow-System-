import { Injectable, signal } from '@angular/core';

export type Theme = 'medflow-light' | 'medflow-dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'medflow-theme';
  currentTheme = signal<Theme>('medflow-light');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    let savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    
    // Safely check system preference
    let systemPrefersDark = false;
    try {
        systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch(e) {}
    
    if (savedTheme === 'medflow-light' || savedTheme === 'medflow-dark') {
      this.setTheme(savedTheme);
    } else if (systemPrefersDark) {
      this.setTheme('medflow-dark');
    } else {
      this.setTheme('medflow-light');
    }
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    try {
        localStorage.setItem(this.THEME_KEY, theme);
    } catch(e) {}
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme() === 'medflow-light' ? 'medflow-dark' : 'medflow-light');
  }
}
