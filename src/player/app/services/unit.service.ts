import { Injectable, signal } from '@angular/core';

import { SceneData, UnitData } from '../models/unit.model';
import { PlayerConfig } from '../../../verona/verona.interfaces';

@Injectable({
  providedIn: 'root'
})

export class UnitService {
  serviceName = 'UnitService';
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
    this.playerConfig = {};
  }

  setNewData(data: any) {
    console.log(this.serviceName, 'setNewData', data);
    this.resetData();
    const unitData = data as UnitData;

    if (unitData.backgroundColor) this.unitData.backgroundColor = unitData.backgroundColor;
    if (unitData.scenes) this.unitData.scenes = unitData.scenes;
    if (unitData.animations) this.unitData.animations = unitData.animations;

    if (this.unitData.scenes.length > 0) {
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

  nextScene() {
    console.log("nextScene");
    if (this.unitData.scenes.length > 0) {
      this.unitData.scenes.shift();
      this.sceneData.set(this.unitData.scenes[0]);
    }
  }

  getAnimationSrc(animationId: string): string {
    const animationSrc = this.unitData.animations.find((a) => a.id === animationId);
    return animationSrc?.animationSrc || '';
  }
}
