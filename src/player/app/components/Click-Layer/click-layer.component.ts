import { Component, output } from '@angular/core';

@Component({
  selector: 'click-layer',
  templateUrl: './click-layer.component.html',
  styleUrls: ['./click-layer.component.scss']
})

export class ClickLayerComponent {
  hasClicked = output<boolean>();
}
