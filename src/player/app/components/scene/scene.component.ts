import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';

import { UnitService } from '../../services/unit.service';
import { AnimationService } from '../../services/animation.service';
import { AnimationComponent } from '../animation/animation.component';
import { AnimationSources, InteractionParameters, SceneData } from '../../models/unit.model';
import { OptionsComponent } from '../options/options.component';

@Component({
  selector: 'scene',
  templateUrl: './scene.component.html',
  imports: [AnimationComponent, OptionsComponent],
  styleUrls: ['./scene.component.scss']
})

export class SceneComponent {
  unitService = inject(UnitService);
  animationService = inject(AnimationService);

  sceneData = input.required<SceneData>();

  backgroundData= signal<AnimationSources>({} as AnimationSources);
  foregroundData= signal<AnimationSources>({} as AnimationSources);
  cockpitData = signal<string>('');
  interactionData = signal<InteractionParameters>({} as InteractionParameters );

  oldSceneData = {} as SceneData

  resetData() {
    this.backgroundData.set({} as AnimationSources);
    this.foregroundData.set({} as AnimationSources);
    this.cockpitData.set('');
    this.interactionData.set({} as InteractionParameters);
  }

  constructor() {
    // new sceneData
    effect(() => {
      if (this.sceneData() && this.sceneData() !== this.oldSceneData) {
        this.resetData();

        this.oldSceneData = this.sceneData();

        // TODO make iteration out of it
        const backgroundIds = this.sceneData().backgroundIds || [];
        if (backgroundIds.length > 0 && backgroundIds[0] !== '') {
          const animationSrc = this.unitService.getAnimationSrc(backgroundIds[0]) || '';
          if (animationSrc) {
            this.backgroundData.set({
              animationSrc: animationSrc,
              id: 'background',
              slotId: 'background',
              loop: true,
              loopCount: 0
            });
          } else {
            this.backgroundData.set({} as AnimationSources);
          }
        }

        const foregroundIds = this.sceneData().foregroundIds || [];
        if (foregroundIds.length > 0 && foregroundIds[0] !== '') {
          const animationSrc = this.unitService.getAnimationSrc(foregroundIds[0]) || '';
          if (animationSrc) {
            this.foregroundData.set({
              animationSrc: animationSrc,
              id: 'foreground',
              slotId: 'foreground',
              loop: true,
              loopCount: 0
            });
          } else {
            this.foregroundData.set({} as AnimationSources);
          }
        }

        if (this.sceneData().interaction && this.sceneData().interactionType === 'BUTTONS') {
          this.interactionData.set(this.sceneData().interactionParameters || {} as InteractionParameters);
        }

        this.cockpitData.set(this.sceneData().cockpitSrc || '');

        this.animationService.setAnimationData(this.sceneData().script);
        this.animationService.startAnimation();
      }
    });
  }

  valueChanged(value: string) {
    if (this.interactionData()?.sharedId) {
      this.unitService.setNewSharedParameter({
        key: this.interactionData().sharedId,
        value: value
      });
    }
    this.animationService.nextAnimation();
  }
}
