import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent {
  @Input() progress: number = 0;

  // Bu fonksiyonu çağırarak progress bar'ı güncelleyebilirsin
  setProgress(value: number) {
    if (value >= 0 && value <= 100) {
      this.progress = value;
    }
  }
}
