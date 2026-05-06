import { Component, effect, input, output, signal } from '@angular/core';

import { AnimationData, InteractionData, InteractionOptions } from '../../models/unit.model';
import { ScriptAnimationComponent } from '../script-animation/script-animation.component';

@Component({
  selector: 'options-parameters',
  templateUrl: './options.component.html',
  imports: [
    ScriptAnimationComponent
  ],
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

  isAnimation(src: string) {
    return src.startsWith('data:@file/zip');
  }

  getAnimationData(option: InteractionOptions) {
    const animationData: AnimationData = {} as AnimationData;
    if (option.imageSrc) {
      animationData.animationSrc = option.imageSrc;
      animationData.id = option.value;
      animationData.loop = true;
      animationData.loopCount = 0;
    }
    return animationData;
  }

  onClick(value: string) {
    this.valueClicked.emit(value);
  }
}
