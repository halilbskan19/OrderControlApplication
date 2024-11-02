import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent {
  /**
   * İlerlemenin yüzdesel değeri (0-100 arası). Varsayılan değer 0'dır.
   */
  @Input() progress: number = 0;
  @Input() currentValue: number = 0;
  @Input() totalValue: number = 0;

  /**
   * İlerlemenin yüzdesel değerini günceller.
   * @param value Güncellenmek istenen ilerleme yüzdesi (0-100 arası)
   */
  setProgress(value: number): void {
    if (this.isValidProgress(value)) {
      this.progress = value;
    }
  }

  /**
   * Geçerli bir ilerleme yüzdesi olup olmadığını kontrol eder.
   * @param value Kontrol edilecek ilerleme yüzdesi
   * @returns Geçerli olup olmadığına dair boolean
   */
  private isValidProgress(value: number): boolean {
    return value >= 0 && value <= 100;
  }
}
