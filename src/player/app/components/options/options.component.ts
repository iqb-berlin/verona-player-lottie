import { Component, effect, input, output, signal } from '@angular/core';

import { InteractionData, InteractionOptions } from '../../models/unit.model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'options-parameters',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})

export class OptionsComponent {
  data = input.required<InteractionData>();
  valueClicked = output<string>();

  options = signal<InteractionOptions[]>([]);

  constructor() {
    effect(() => {
      console.log('option', this.data());
      this.options.set(this.data().options || []);
    });
  }

  onClick(value: string) {
    this.valueClicked.emit(value);
  }
}
