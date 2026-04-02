import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';

import { UnitService } from '../../services/unit.service';
import { AnimationService } from '../../services/animation.service';
import { ScriptAnimationComponent } from '../script-animation/script-animation.component';
import { AnimationData, InteractionData, SceneData } from '../../models/unit.model';
import { OptionsComponent } from '../options/options.component';

@Component({
  selector: 'scene',
  templateUrl: './scene.component.html',
  imports: [ScriptAnimationComponent, OptionsComponent],
  styleUrls: ['./scene.component.scss']
})

export class SceneComponent {
  unitService = inject(UnitService);
  animationService = inject(AnimationService);

  sceneData = input.required<SceneData>();

  backgroundData= signal<AnimationData>({} as AnimationData);
  foregroundData= signal<AnimationData>({} as AnimationData);
  cockpitData = signal<string>('');
  interactionData = signal<InteractionData>({} as InteractionData );

  resetData() {
    this.backgroundData.set({} as AnimationData);
    this.foregroundData.set({} as AnimationData);
    this.cockpitData.set('');
    this.interactionData.set({} as InteractionData);
  }

  constructor() {
    // new sceneData
    effect(() => {
      if (this.sceneData()) {
        this.resetData();

        console.log("sceneData", this.sceneData());

        const backgroundIds = this.sceneData().backgroundIds || [];
        if (backgroundIds.length > 0 && backgroundIds[0] !== '') {
          const animationSrc = this.unitService.getAnimationSrc(backgroundIds[0]) || '';
          if (animationSrc) {
            this.backgroundData.set({
              animationSrc: animationSrc,
              id: 'background',
              loop: true,
              loopCount: 0
            });
          } else {
            this.backgroundData.set({} as AnimationData);
          }
        }

        const foregroundIds = this.sceneData().foregroundIds || [];
        if (foregroundIds.length > 0 && foregroundIds[0] !== '') {
          const animationSrc = this.unitService.getAnimationSrc(foregroundIds[0]) || '';
          if (animationSrc) {
            this.foregroundData.set({
              animationSrc: animationSrc,
              id: 'foreground',
              loop: true,
              loopCount: 0
            });
          } else {
            this.foregroundData.set({} as AnimationData);
          }
        }

        if (this.sceneData().interaction && this.sceneData().interactionType === 'BUTTONS' &&
          this.sceneData().interactionParameters) {
          this.interactionData.set(this.sceneData().interactionParameters || {} as InteractionData);
        }

        this.cockpitData.set(this.sceneData().cockpitSrc || '');

        console.log("interactionData", this.interactionData());
        console.log("background", this.backgroundData());
        console.log("foreground", this.foregroundData());

        this.animationService.setAnimationData(this.sceneData().script);
        this.animationService.startAnimation();
      }
    });
  }
}
