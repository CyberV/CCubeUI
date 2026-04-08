import { Component, OnInit } from '@angular/core';
import { OfflineService } from '../../services/offline.service';

@Component({
  selector: 'app-offline-badge',
  templateUrl: './offline-badge.component.html',
  styleUrls: ['./offline-badge.component.scss']
})
export class OfflineBadgeComponent implements OnInit {
  offline = false;

  constructor(private offlineService: OfflineService) {}

  ngOnInit(): void {
    this.offlineService.events().subscribe((v) => (this.offline = v));
  }

  toggle(): void {
    if (this.offline) {
      this.offlineService.disable();
    } else {
      this.offlineService.enable();
    }
  }
}
