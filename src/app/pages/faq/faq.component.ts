import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { TelemetryService } from '../../services/telemetry.service';

interface FaqItem {
  question: string;
  answer: string;
  tags: string[];
  open?: boolean;
}

/**
 * FaqComponent – N6 (see docs/06-additional-insights.md §6)
 *
 * Standalone component rendering an accordion-style FAQ from
 * src/assets/faq.json. The JSON is loaded via HttpClient so the same
 * contract can later be swapped for a live CMS endpoint without touching
 * the template.
 */
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqs: FaqItem[] = [];
  filter = '';

  constructor(private http: HttpClient, private telemetry: TelemetryService) {}

  ngOnInit(): void {
    this.http.get<{ faqs: FaqItem[] }>('assets/faq.json').subscribe((res) => {
      this.faqs = (res && res.faqs) || [];
    });
    this.telemetry.track('feature.faq.viewed', {});
  }

  filtered(): FaqItem[] {
    const q = this.filter.trim().toLowerCase();
    if (!q) { return this.faqs; }
    return this.faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  toggle(item: FaqItem): void {
    item.open = !item.open;
    if (item.open) {
      this.telemetry.track('feature.faq.expanded', { question: item.question });
    }
  }
}
