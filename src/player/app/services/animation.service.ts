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
  private _currentScene = signal<ScriptData>({} as ScriptData);
  currentScene = this._currentScene.asReadonly();

  private _currentAnimationData = signal<AnimationData[]>([]);
  currentAnimationData = this._currentAnimationData.asReadonly();

  private sceneList: ScriptData[] = [];
  private currentScriptIndex = 0;
  private isBusy = false;
  private hasAudio = false;
  private audioFinished = false;

  setAnimationData(data: ScriptData[]) {
    // console.log('setAnimationData', data);
    if (data && data.length) this.sceneList = data;
    this.currentScriptIndex = 0;
  }

  startAnimation() {
    if (this.currentScriptIndex < this.sceneList.length) {
      // console.log('startAnimation', this.sceneList[this.currentScriptIndex]);
      this.audioFinished = false;
      this.hasAudio = false;
      this._currentScene.set(this.sceneList[this.currentScriptIndex]);
      this._currentAnimations.set(this.currentScene()?.animationIds || []);
      this._currentAnimationData.set([]);

      // console.log(this._currentAnimations());
      this._currentAnimations().forEach((data, index) => {
        const animationSrc = this.unitService.getAnimationSrc(data);
        const animationData: AnimationData = {} as AnimationData;
        let loopCount = 0;
        if (data.startsWith('avatar')) loopCount = this.currentScene()?.loopCount || 0;
        if (data.startsWith('bubble') || data.startsWith('intro')) loopCount = 1;
        if (animationSrc) {
          animationData.animationSrc = animationSrc;
          animationData.id = data;
          animationData.loop = this.currentScene()?.loop || false;
          animationData.loopCount = loopCount || 0;
        }
        const currentAnimationData = this.currentAnimationData();
        currentAnimationData.push(animationData);
        this._currentAnimationData.set(currentAnimationData);
        // console.log(this.currentAnimationData());
      })

      if (this.currentScene()?.audioSrc) {
        this.hasAudio = true;
        this.audioFinished = false;
        this.audioService.setAudioSrc(this.currentScene()?.audioSrc || '')
          .then(() => {
            // console.log("Audio Src loaded");
            this.audioService.getPlayFinished()
              .then(() => {
                // console.log("Audio Src finished");
                this.audioFinished = true;
                if (this.currentScene()?.waitForAudioToFinish === true) {
                  this.nextAnimation();
                }
              });
          });
      }
    }
  }

  loopFinished(animationId: string) {
    // console.log("loop", animationId);
    if (this.hasAudio) {
      if (this.currentScene()?.waitForAudioToFinish === true && this.audioFinished) this.nextAnimation();
    }
  }

  completed(animationId: string) {
    // console.log("completed", animationId);
    if (this.hasAudio) {
      if (this.currentScene()?.waitForAudioToFinish === false) this.nextAnimation();
    } else {
      if (this.currentScene()?.loopCount === 0) return;
      this.nextAnimation();
    }
  }

  nextAnimation() {
    // console.log("nextAnimation");
    if (this.isBusy) return;
    this.isBusy = true;
    this.currentScriptIndex++;
    if (this.currentScriptIndex < this.sceneList.length) {
      this.startAnimation();
    } else {
      this.unitService.nextScene();
    }
    setTimeout(() => this.isBusy = false, 100);
  }
}
