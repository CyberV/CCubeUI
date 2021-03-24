import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginService } from 'app/login/login.service';
import { PlanService } from 'app/services/plan.service';

@Component({
  selector: 'app-reschedule',
  templateUrl: './reschedule.component.html',
  styleUrls: ['./reschedule.component.scss'],
})
export class RescheduleComponent implements OnInit {

  @Input() canReschedule: boolean;
  @Input() count: number;
  @Input() schedule: any;

  @Input() lastDate: string;

  @Input() forAdhoc: boolean;
  @Input() adhoc: any;

  selectedDate: any;
  dateError: any;

  get today() {
    return new Date(this.schedule.date).toDateString();
  }

  get expiry() {
    return new Date(this.adhoc.expiresOn).toDateString();
  }

  constraints: any;
  loading: boolean;

  constructor(
    private modalController: ModalController,
    private loginService: LoginService,
    private planService: PlanService
  ) {
    this.canReschedule = true;
    this.count = 1;
    this.lastDate = '';
    this.selectedDate = null;
    this.dateError = null;
    this.forAdhoc = false;
    this.loading = false;
    this.adhoc = {};
  }

  validate = dateString => {
    const day = (new Date(dateString)).getDay();
    if (day == 3) {
      return false;
    }
    return true;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async reschedule() {
    let sub = this.planService.getCurrentSubscription();
    this.loading = true;

    let st = new Date(this.today).toDateString(),
      end = new Date(this.selectedDate).toDateString();

    if (sub) {
      this.loginService.rescheduleService(sub.phone, sub.car.regNo, st, end, this.forAdhoc ? this.adhoc.addon.name : '')
        .subscribe((response: any) => {
          this.loading = false;
          if (response.success) {
            this.dismiss();
          } else {
            alert(response.errorMsg || response.error);
          }
        })

    } else {
      alert('It aint right');
    }

  }

  checkDate(e) {
    if (!this.validate(e)) {
      this.dateError = 'Wednesdays are Off!';
      this.selectedDate = null;
    } else {
      this.selectedDate = e;
      this.dateError = null;
    }
  }

  isAfter7pm() {
    let now: any = new Date().toLocaleTimeString();
    let later = "7:00:00 PM";

    return now > later;
  }

  ngOnChanges(changes) {
    if (this.schedule && this.lastDate) {
      if (this.forAdhoc) {
        this.constraints = {
          min: new Date(+(new Date()) + (86400000 * (this.isAfter7pm() ? 2 : 1))).toISOString().split('T')[0],
          max: new Date(+(new Date(this.lastDate))).toISOString().split('T')[0]
        };
      } else {


        this.constraints = {
          min: new Date(+(new Date(this.schedule.date)) + (86400000 * (this.isAfter7pm() ? 2 : 1))).toISOString().split('T')[0],
          max: new Date(+(new Date(this.lastDate)) + 86400000).toISOString().split('T')[0]
        };
      }
      console.log('constraints', this.constraints);
    }
  }

  ngOnInit() {
    if (this.schedule && this.lastDate) {
      if (this.forAdhoc) {
        this.constraints = {
          min: new Date(+(new Date()) + (86400000 * (this.isAfter7pm() ? 2 : 1))).toISOString().split('T')[0],
          max: new Date(+(new Date(this.lastDate))).toISOString().split('T')[0]
        };
      } else {


        this.constraints = {
          min: new Date(+(new Date(this.schedule.date)) + (86400000 * (this.isAfter7pm() ? 2 : 1))).toISOString().split('T')[0],
          max: new Date(+(new Date(this.lastDate)) + 86400000).toISOString().split('T')[0]
        };
      }
      console.log('constraints', this.constraints);
    }
  }

}
