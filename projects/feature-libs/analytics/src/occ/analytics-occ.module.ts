import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ConfigModule, provideDefaultConfig } from "@spartacus/core";
import { customGlobalMessageConfig, defaultOccAnalyticsConfig } from "./config";

@NgModule({
    imports: [
        CommonModule,
        ConfigModule.withConfig(customGlobalMessageConfig),
    ],

    providers: [provideDefaultConfig(defaultOccAnalyticsConfig),],
})
export class AnalyticsOccModule { }