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

  backgroundData= signal('');
  foregroundData = signal('');

  ngOnInit() {
    if (this.unitService.getCockpitSrc()) this.foregroundData.set(this.unitService.getCockpitSrc());
    if (this.unitService.getBackgroundSrc()) this.backgroundData.set(this.unitService.getBackgroundSrc());
    this.animationService.setAnimationData();
    this.animationService.startAnimation();
  }

  loopFinished(animationId: string) {
    console.log('Loop finished', animationId);
  }
}
