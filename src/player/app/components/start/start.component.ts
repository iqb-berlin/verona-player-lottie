import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { UnitService } from '../../services/unit.service';
import { SceneComponent } from '../scene/scene.component';
import { AnimationData, SceneData } from '../../models/unit.model';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'start-scene',
  templateUrl: './start.component.html',
  imports: [SceneComponent],
  styleUrls: ['./start.component.scss']
})

export class StartComponent implements OnInit {
  unitService = inject(UnitService);
  animationService = inject(AnimationService);

  backgroundData= signal<AnimationData>({} as AnimationData);
  foregroundData= signal<AnimationData>({} as AnimationData);
  cockpitData = signal<string>('');

  ngOnInit() {
    if (this.unitService.getCockpitSrc()) this.cockpitData.set(this.unitService.getCockpitSrc());
    if (this.unitService.getBackgroundSrc()) {
      this.backgroundData.set({
        animationSrc: this.unitService.getBackgroundSrc(),
        id: 'background',
        loop: true,
        loopCount: 0
      });
    }
    if (this.unitService.getForegroundSrc()) {
      this.foregroundData.set({
        animationSrc: this.unitService.getForegroundSrc(),
        id: 'background',
        loop: true,
        loopCount: 0
      });
    }
    this.animationService.setAnimationData();
    this.animationService.startAnimation();
  }
}
