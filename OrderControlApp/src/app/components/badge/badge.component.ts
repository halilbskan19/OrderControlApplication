import { Component, Input } from '@angular/core';

// Badge boyutları için kullanılacak enum
export type BadgeSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  /**
   * Badge üzerinde görüntülenecek metin.
   */
  @Input() title: string = '';

  /**
   * Badge üzerinde görüntülenecek değer. Örneğin, sayılar veya metin olabilir.
   */
  @Input() count: string = '';

  /**
   * Badge'in rengi. Varsayılan olarak 'primary' olarak ayarlanmıştır.
   */
  @Input() color: string = 'primary';

  /**
   * Badge'in boyutu. Seçenekler: 'small', 'medium', 'large'. Varsayılan olarak 'medium' olarak ayarlanmıştır.
   */
  @Input() size: BadgeSize = 'medium';
}
