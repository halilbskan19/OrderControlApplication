import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  @Input() title: string = ''; // Badge metni
  @Input() count: string = ''; // Badge değeri
  @Input() color: string = 'primary'; // Badge'in rengi (default olarak primary)
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
