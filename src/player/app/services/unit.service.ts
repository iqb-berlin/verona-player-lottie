import { inject, Injectable, signal } from '@angular/core';

import { SceneData, UnitData } from '../models/unit.model';
import { PlayerConfig, SharedParameter } from '../../../verona/verona.interfaces';
import { VeronaPostService } from '../../../verona/player/verona-post.service';

@Injectable({
  providedIn: 'root'
})

export class UnitService {
  serviceName = 'UnitService';

  veronaPostService = inject(VeronaPostService);
  currentSceneIndex = signal<number>(0);
  isUnitLoaded = signal<boolean>(false);
  sceneData = signal<SceneData>({} as SceneData)

  unitData: UnitData = {
    backgroundColor: '#000000',
    scenes: [],
    animations: []
  };

  playerConfig: PlayerConfig = {};

  resetData() {
    this.unitData.backgroundColor = '#000000';
    this.unitData.scenes = [];
    this.unitData.animations = [];
    this.playerConfig = {
      sharedParameters: []
    };
    this.currentSceneIndex.set(0);
  }

  setNewData(data: any) {
    console.log(this.serviceName, 'setNewData', data);
    this.resetData();
    const unitData = data as UnitData;

    if (unitData.backgroundColor) this.unitData.backgroundColor = unitData.backgroundColor;
    if (unitData.scenes) this.unitData.scenes = unitData.scenes;
    if (unitData.animations) this.unitData.animations = unitData.animations;

    if (this.unitData.scenes.length > 0) {
      this.currentSceneIndex.set(0);
      this.sceneData.set(this.unitData.scenes[0]);
    }

    this.isUnitLoaded.set(true);
  }

  setPlayerConfig(playerConfig: PlayerConfig) {
    console.log(this.serviceName, 'setPlayerConfig', playerConfig);

    // only need the playerConfig for sharedParameters
    if (playerConfig.sharedParameters && playerConfig.sharedParameters.length)
      this.playerConfig = playerConfig;
  }

  setNewSharedParameter(parameter: SharedParameter) {
    this.playerConfig.sharedParameters?.push(parameter);
    this.veronaPostService.sendVopStateChangedNotification({
      playerState: this.playerConfig
    })
  }

  nextScene() {
    console.log("nextScene");
    this.currentSceneIndex.update(v => v + 1);
    if (this.currentSceneIndex() < this.unitData.scenes.length) {
      this.sceneData.set(this.unitData.scenes[this.currentSceneIndex()]);
    }
  }

  getAnimationSrc(animationId: string): string {
    console.log("getAnimationSrc", animationId);
    const animationSrc = this.unitData.animations.find((a) => a.id === animationId);
    if (animationSrc?.animationSrc) {
      return animationSrc?.animationSrc as string;
    } else {
      if (animationSrc?.animations && animationSrc?.parameterId) {
        const parameter = this.playerConfig.sharedParameters?.find(v => v.key === animationSrc.parameterId)?.value || undefined;
        if (parameter) {
          console.log('ani', animationSrc);
          return animationSrc.animations.find(v => v.id === parameter)?.animationSrc || '';
        } else {
          return animationSrc.animations[0].animationSrc || '';
        }
      }
    }
    return '';
  }
}
