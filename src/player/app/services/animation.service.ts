import { inject, Injectable, signal } from '@angular/core';
import { UnitService } from './unit.service';
import { AnimationData, SceneData } from '../models/unit.model';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})

export class AnimationService {
  unitService = inject(UnitService);
  audioService = inject(AudioService);

  private _currentAnimations = signal<string[]>([]);
  currentAnimations = this._currentAnimations.asReadonly();
  private _currentScene = signal<SceneData | undefined>(undefined);
  currentScene = this._currentScene.asReadonly();

  private _currentMain = signal<string>('');
  currentMain = this._currentMain.asReadonly();
  private _currentSecond = signal<string>('');
  currentSecond = this._currentSecond.asReadonly();

  private sceneList: SceneData[] = [];
  private hasAudio = false;
  private audioFinished = false;



  setAnimationData() {
    this.sceneList = this.unitService.unitData.script;
  }

  startAnimation() {
    if (this.sceneList.length > 0) {
      this._currentScene.set(this.sceneList[0]);
      this._currentAnimations.set(this.currentScene()?.animationIds || []);
      if (this.currentAnimations().length > 0) {
        const animationSrc = this.unitService.getAnimationSrc(this.currentAnimations()[0]);
        this._currentMain.set(animationSrc);
        if (this.currentAnimations().length > 1) {
          const animationSrc = this.unitService.getAnimationSrc(this.currentAnimations()[1]);
          this._currentSecond.set(animationSrc);
        }
      }
      if (this.currentScene()?.audioSrc) {
        this.audioService.setAudioSrc(this.currentScene()?.audioSrc || '')
          .then(() => {
            this.audioService.getPlayFinished()
              .then(() => {
                this.audioFinished = true;
                this.nextScene();
              });
          });
      }
    }
  }

  hasEnded(animationId: string) {

  }

  nextScene() {
    if (this.sceneList.length > 0) {
      this.sceneList.shift();
      this.startAnimation();
    }
  }


}
