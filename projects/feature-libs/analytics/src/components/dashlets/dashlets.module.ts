import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { OrderDashletComponent } from "./orderDashlet/orderDashlet.component";
import { TicketDashletComponent } from "./ticketDashlet/ticketDashlet.component";
import { ChannelDashletComponent } from "./channelDashlet/channelDashlet.component";
import { UserDashletComponent } from "./userDashlet/userDashlet.component";
import { CronJobDashletComponent } from "./cronJobDashlet/cronJobDashlet.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    OrderDashletComponent,
    TicketDashletComponent,
    ChannelDashletComponent,
    CronJobDashletComponent,
    UserDashletComponent
  ],
  providers: [
  ],
  exports: [
    OrderDashletComponent,
    TicketDashletComponent,
    ChannelDashletComponent,
    CronJobDashletComponent,
    UserDashletComponent
  ],
})
export class DashletsComponentModule { }