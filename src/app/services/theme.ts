import { Injectable } from '@angular/core';

export interface AppTheme {
  id: string;
  label: string;
  iconColor: string;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  public themes: AppTheme[] = [
    { id: 'rojo-negro', label: '🔴⚫ Rojo - Negro', iconColor: '#d32f2f' },
    { id: 'rojo-blanco', label: '🔴⚪ Rojo - Blanco', iconColor: '#c62828' },
    { id: 'azul-negro', label: '🔵⚫ Azul - Negro', iconColor: '#1e88e5' },
    { id: 'azul-blanco', label: '🔵⚪ Azul - Blanco', iconColor: '#1565c0' },
    { id: 'verde-negro', label: '🟢⚫ Verde - Negro', iconColor: '#00a884' },
    { id: 'verde-blanco', label: '🟢⚪ Verde - Blanco', iconColor: '#008069' },
  ];

  constructor() {
    const saved = localStorage.getItem('chatdual_theme') || 'rojo-negro';
    this.applyTheme(saved);
  }

  applyTheme(themeId: string) {
    document.body.setAttribute('data-theme', themeId);
    localStorage.setItem('chatdual_theme', themeId);
  }

  getCurrentTheme(): string {
    return localStorage.getItem('chatdual_theme') || 'rojo-negro';
  }
}