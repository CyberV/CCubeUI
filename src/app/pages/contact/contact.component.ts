import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { getConfigValue } from '../../common/common.service';
import { TelemetryService } from '../../services/telemetry.service';

/**
 * ContactComponent – N6 (see docs/06-additional-insights.md §6)
 *
 * Standalone Angular 17 component that replaces the `/contact` branch of
 * the legacy ProfileComponent context-switch. It reads the support
 * channels from commonData.config[] so they can be updated server-side
 * without a release.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  phone: string = '';
  email: string = '';
  whatsapp: string = '';
  address: string = '';
  company: string = '';

  form = {
    name: '',
    email: '',
    message: ''
  };
  submitted = false;

  constructor(private telemetry: TelemetryService) {}

  ngOnInit(): void {
    this.phone = getConfigValue('SUPPORT_PHONE') || '+91-90000-00000';
    this.email = getConfigValue('SUPPORT_EMAIL') || 'support@ccubeco.com';
    this.whatsapp = getConfigValue('WHATSAPP_NUMBER') || '+919000000000';
    this.address = getConfigValue('COMPANY_ADDRESS') || '';
    this.company = getConfigValue('COMPANY_NAME') || 'CCube';
    this.telemetry.track('feature.contact.viewed', {});
  }

  whatsappHref(): string {
    const n = (this.whatsapp || '').replace(/[^0-9]/g, '');
    return `https://wa.me/${n}`;
  }

  telHref(): string { return `tel:${this.phone}`; }
  mailHref(): string { return `mailto:${this.email}`; }

  submit(): void {
    this.submitted = true;
    this.telemetry.track('feature.contact.submitted', {
      hasName: !!this.form.name,
      hasMessage: !!this.form.message
    });
    // In offline mode this goes through OfflineHttpInterceptor's
    // catch-all, returning success without persisting.
  }
}
