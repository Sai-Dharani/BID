import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  standalone: false
})
export class AnalyticsComponent {


  slidesData = [
    {
      title: 'Business Intelligence Dashboard',
      tag: ' INSIGHTS',
      desc: 'DXC’s SAP Commerce Business Intelligence dashboard delivers essential commerce insights directly to your team, empowering everyone to make data-driven decisions.',
      image: './assets/icons/bia/banner1.png'
    },
    {
      title: 'Order Summary',
      tag: 'REVENUE',
      desc: 'This section provides insights the revenue generated through Orders, categorized as stuck, completed, cancelled, and more.',
      image: './assets/icons/bia/banner2.png'
    },
    {
      title: 'Ticket Summary',
      tag: 'SUPPORT',
      desc: 'This section provides insights into the customer tickets, categorized as open, closed, etc.',
      image: './assets/icons/bia/banner3.png'
    },
    {
      title: 'Channel Summary',
      tag: 'CHANNELS',
      desc: 'This section provides insights orders placed through different channels, such as web, mobile, or tablet.',
      image: './assets/icons/bia/banner4.png'
    },
    {
      title: 'Cron Job Summary',
      tag: 'CRON JOBS',
      desc: 'This section provides insights scheduled cron job executions, including job status, run history, and any failed or pending jobs.',
      image: './assets/icons/bia/banner5.png'
    },
    {
      title: 'Interface Status Summary',
      tag: 'INTERFACES',
      desc: 'This section shows the current status of system interfaces and integrations, highlighting active URLs, response codes, and connectivity health.',
      image: './assets/icons/bia/banner6.png'
    },
    {
      title: 'User Registration/Closed Summary View',
      tag: 'USER REGISTRATION',
      desc: 'This section provides a summary of registered users and closed registrations, helping track overall user onboarding status and completion.',
      image: './assets/icons/bia/banner7.png'
    },
    {
      title: 'User Activity Summary',
      tag: 'USER ACTIVITY',
      desc: 'This section provides insights user activity such as active vs inactive users, recent engagement trends, and usage over a selected period.',
      image: './assets/icons/bia/banner8.png'
    }
  ];

  index = 0;
  private autoSlideInterval!: any;
  private chartAccentInterval!: any;
  private chartAccentIndex = 0;
  chartAccentTypes: Array<'pie' | 'bar' | 'line' | 'donut' | 'area' | 'scatter' | 'radar'> = ['pie', 'bar', 'line', 'donut', 'area', 'scatter', 'radar'];
  currentChartAccent: 'pie' | 'bar' | 'line' | 'donut' | 'area' | 'scatter' | 'radar' = 'pie';

  ngOnInit(): void {
    this.startAutoSlide();
    this.startChartAccentRotation();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    this.stopChartAccentRotation();
  }

  next(): void {
    this.index = (this.index + 1) % this.slidesData.length;
  }

  prev(): void {
    this.index =
      (this.index - 1 + this.slidesData.length) % this.slidesData.length;
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.next();
    }, 10000); // 10 seconds
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private startChartAccentRotation(): void {
    this.chartAccentInterval = setInterval(() => {
      this.chartAccentIndex = (this.chartAccentIndex + 1) % this.chartAccentTypes.length;
      this.currentChartAccent = this.chartAccentTypes[this.chartAccentIndex];
    }, 2500);
  }

  private stopChartAccentRotation(): void {
    if (this.chartAccentInterval) {
      clearInterval(this.chartAccentInterval);
    }
  }
}
