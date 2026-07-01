import { Component, effect, inject, input, signal } from '@angular/core';

import { UnitService } from '../../services/unit.service';
import { AnimationService } from '../../services/animation.service';
import { AnimationComponent } from '../animation/animation.component';
import { AnimationData, InteractionData, SceneData } from '../../models/unit.model';
import { OptionsComponent } from '../options/options.component';
import { ClickLayerComponent } from '../click-layer/click-layer.component';

@Component({
  selector: 'scene',
  templateUrl: './scene.component.html',
  imports: [AnimationComponent, OptionsComponent, ClickLayerComponent],
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
  interactionType = signal<string>('');

  oldSceneData = {} as SceneData

  resetData() {
    this.backgroundData.set({} as AnimationData);
    this.foregroundData.set({} as AnimationData);
    this.cockpitData.set('');
    this.interactionData.set({} as InteractionData);
    this.interactionType.set('');
  }

  constructor() {
    // new sceneData
    effect(() => {
      if (this.sceneData() && this.sceneData() !== this.oldSceneData) {
        this.resetData();

        this.oldSceneData = this.sceneData();

        // console.log("sceneData", this.sceneData());

        // TODO make iteration out of it
        const backgroundIds = this.sceneData().backgroundIds || [];
        if (backgroundIds.length > 0 && backgroundIds[0] !== '') {
          const animationSrc = this.unitService.getAnimationSrc(backgroundIds[0]) || '';
          if (animationSrc) {
            this.backgroundData.set({
              animationSrc: animationSrc,
              id: backgroundIds[0],
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
              id: foregroundIds[0],
              loop: true,
              loopCount: 0
            });
          } else {
            this.foregroundData.set({} as AnimationData);
          }
        }

        if (this.sceneData().interaction && this.sceneData().interactionType) {
          this.interactionType.set(this.sceneData().interactionType || '');
          if (this.interactionType() === 'BUTTONS')
            this.interactionData.set(this.sceneData().interactionParameters || {} as InteractionData);
        }

        this.cockpitData.set(this.sceneData().cockpitSrc || '');

        // console.log("interactionData", this.interactionData());
        // console.log("background", this.backgroundData());
        // console.log("foreground", this.foregroundData());

        this.animationService.setAnimationData(this.sceneData().script);
        this.animationService.startAnimation();
      }
    });
  }

  valueChanged(value: any) {
    // console.log('valueChanged', value);
    if (this.interactionData()?.sharedId) {
      this.unitService.setNewSharedParameter({
        key: this.interactionData().sharedId,
        value: value
      });
    }
    this.animationService.nextAnimation();
  }
}
