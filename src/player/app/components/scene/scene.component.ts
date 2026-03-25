import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';

import { UnitService } from '../../services/unit.service';
import { ScriptAnimationComponent } from '../script-animation/script-animation.component';
import { AnimationData, SceneData } from '../../models/unit.model';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'scene',
  templateUrl: './scene.component.html',
  imports: [ScriptAnimationComponent],
  styleUrls: ['./scene.component.scss']
})

export class SceneComponent {
  unitService = inject(UnitService);
  animationService = inject(AnimationService);

  sceneData = input.required<SceneData>();

  backgroundData= signal<AnimationData>({} as AnimationData);
  foregroundData= signal<AnimationData>({} as AnimationData);
  cockpitData = signal<string>('');

  resetData() {
    this.backgroundData.set({} as AnimationData);
    this.foregroundData.set({} as AnimationData);
    this.cockpitData.set('');
  }

  constructor() {
    // new sceneData
    effect(() => {
      if (this.sceneData()) {
        this.resetData();

        console.log("sceneData", this.sceneData());

        const backgroundIds = this.sceneData().backgroundIds || [];
        if (backgroundIds.length > 0 && backgroundIds[0] !== '') {
          this.backgroundData.set({
            animationSrc: backgroundIds[0],
            id: 'background',
            loop: true,
            loopCount: 0
          });
        }

        const foregroundIds = this.sceneData().foregroundIds || [];
        if (foregroundIds.length > 0 && foregroundIds[0] !== '') {
          this.foregroundData.set({
            animationSrc: foregroundIds[0],
            id: 'foreground',
            loop: true,
            loopCount: 0
          });
        }

        this.cockpitData.set(this.sceneData().cockpitSrc || '');

        this.animationService.setAnimationData(this.sceneData().script);
        this.animationService.startAnimation();
      }
    });
  }
}
