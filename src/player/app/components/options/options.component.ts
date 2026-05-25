import { Component, effect, input, output, signal } from '@angular/core';

import { AnimationSources, InteractionParameters, InteractionOptions } from '../../models/unit.model';
import { AnimationComponent } from '../animation/animation.component';

@Component({
  selector: 'options-parameters',
  templateUrl: './options.component.html',
  imports: [AnimationComponent],
  styleUrls: ['./options.component.scss']
})

export class OptionsComponent {
  data = input.required<InteractionParameters>();
  optionClicked = output<string>();

  options = signal<InteractionOptions[]>([]);

  constructor() {
    effect(() => {
      this.options.set(this.data().options || []);
    });
  }

  isAnimation(src: string) {
    return src.startsWith('data:@file/zip');
  }

  getAnimationData(option: InteractionOptions) {
    const animationData: AnimationSources = {} as AnimationSources;
    if (option.imageSrc) {
      animationData.animationSrc = option.imageSrc;
      animationData.id = option.value;
      animationData.loop = true;
      animationData.loopCount = 0;
      animationData.speed = option.speed || 1;
    }
    return animationData;
  }

  onClick(value: string) {
    this.optionClicked.emit(value);
  }
}
