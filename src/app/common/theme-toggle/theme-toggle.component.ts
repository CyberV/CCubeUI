import { Component, OnInit } from '@angular/core';
import { ThemeMode, ThemeService } from '../../services/theme.service';

/**
 * ThemeToggleComponent – N8 (see docs/06-additional-insights.md §8)
 *
 * Tri-state toggle: light / system / dark. Persists via ThemeService.
 */
@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {
  mode: ThemeMode = 'system';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.mode = this.themeService.getMode();
    this.themeService.events().subscribe((m) => (this.mode = m));
  }

  set(m: ThemeMode): void {
    this.themeService.setMode(m);
  }
}
