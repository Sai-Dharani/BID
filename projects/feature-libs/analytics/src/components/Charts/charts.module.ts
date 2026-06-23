import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronJobComponent } from './cron-job/cron-job.component';
import { ChannelComponent } from './channel/channel.component';
import { TicketComponent } from './ticket/ticket.component';
import { UserSummaryComponent } from './user-summary/user-summary.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { OrderSummaryChartComponent } from './order-summary-chart/order-summary-chart.component';
import { InterfaceComponent } from './interface/interface.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CronJobComponent,
    ChannelComponent,
    TicketComponent,
    UserSummaryComponent,
    UserRegistrationComponent,
    OrderSummaryChartComponent,
    InterfaceComponent
  ],
  providers: [
  ],
  exports: [
    CronJobComponent,
    ChannelComponent,
    TicketComponent,
    UserSummaryComponent,
    UserRegistrationComponent,
    OrderSummaryChartComponent,
    InterfaceComponent
  ]
})
export class ChartsModule { }
