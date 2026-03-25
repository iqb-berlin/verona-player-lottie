import { Component, input } from '@angular/core';

@Component({
  selector: 'options-parameters',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})

export class OptionsComponent {
  avatars = input.required<string[]>();

  continueClicked() {

  }
}
