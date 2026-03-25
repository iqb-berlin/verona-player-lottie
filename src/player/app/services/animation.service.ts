import { inject, Injectable, signal } from '@angular/core';

import { UnitService } from './unit.service';
import { AnimationData, ScriptData } from '../models/unit.model';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})

export class AnimationService {
  unitService = inject(UnitService);
  audioService = inject(AudioService);

  private _currentAnimations = signal<string[]>([]);
  currentAnimations = this._currentAnimations.asReadonly();
  private _currentScene = signal<ScriptData | undefined>(undefined);
  currentScene = this._currentScene.asReadonly();

  private _currentMain = signal<AnimationData>({} as AnimationData);
  currentMain = this._currentMain.asReadonly();
  private _currentSecond = signal<AnimationData>({} as AnimationData);
  currentSecond = this._currentSecond.asReadonly();

  private sceneList: ScriptData[] = [];
  private hasAudio = false;
  private audioFinished = false;

  setAnimationData(data: ScriptData[]) {
    console.log('setAnimationData', data);
    if (data && data.length) this.sceneList = data;
  }

  startAnimation() {
    if (this.sceneList.length > 0) {
      this._currentScene.set(this.sceneList[0]);
      this._currentAnimations.set(this.currentScene()?.animationIds || []);
      if (this.currentAnimations().length > 0) {
        const animationSrc = this.unitService.getAnimationSrc(this.currentAnimations()[0]);
        this._currentMain.set({
          animationSrc: animationSrc,
          id: 'main',
          loop: this.currentScene()?.loop || false,
          loopCount: this.currentScene()?.loopCount || 0
        });
        if (this.currentAnimations().length > 1) {
          const animationSrc = this.unitService.getAnimationSrc(this.currentAnimations()[1]);
          this._currentSecond.set({
            animationSrc: animationSrc,
            id: 'second',
            loop: this.currentScene()?.loop || false,
            loopCount: this.currentScene()?.loopCount || 0
          });
        }
      }
      if (this.currentScene()?.audioSrc) {
        this.audioFinished = false;
        this.audioService.setAudioSrc(this.currentScene()?.audioSrc || '')
          .then(() => {
            console.log("Audio Src loaded");
            this.audioService.getPlayFinished()
              .then(() => {
                console.log("Audio Src finished");
                this.audioFinished = true;
                this.nextAnimation();
              });
          });
      }
    }
  }

  loopFinished(animationId: string) {
    if( this.audioFinished ) this.nextAnimation();
  }

  completed(animationId: string) {
    console.log("completed");
    if( this.audioFinished ) this.nextAnimation();
  }

  nextAnimation() {
    console.log("nextAnimation");
    if (this.sceneList.length > 0) {
      this.sceneList.shift();
      this.startAnimation();
    } else {
      this.unitService.nextScene();
    }
  }


}
