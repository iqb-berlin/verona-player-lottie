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

  externalUnitData: UnitData = {
    backgroundColor: '#000000',
    scenes: [],
    animations: []
  }

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
    // console.log(this.serviceName, 'setNewData', data);
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

  addDirectDownload(directDownloadUrl: string) {
    const completeUrl = new URL(directDownloadUrl, parent.location.origin).toString().replace(/\/+$/, '');

    // console.log("DDL", completeUrl);

    fetch(completeUrl + '/avatar/avatar.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load avatar.json: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((avatarData: UnitData) => {
        this.externalUnitData.animations = avatarData.animations || [];
        // console.log(this.serviceName, 'external animations loaded', this.externalUnitData.animations);
      })
      .catch(error => {
        // console.error(this.serviceName, 'failed to load external avatar animations', error);
        this.externalUnitData.animations = [];
      });
  }

  setPlayerConfig(playerConfig: PlayerConfig) {
    // console.log(this.serviceName, 'setPlayerConfig', playerConfig);

    // only need the playerConfig for sharedParameters
    if (playerConfig.sharedParameters && playerConfig.sharedParameters.length)
      this.playerConfig = playerConfig;
    if (playerConfig.directDownloadUrl) {
      this.playerConfig.directDownloadUrl = playerConfig.directDownloadUrl;
    }
  }

  setNewSharedParameter(parameter: SharedParameter) {
    const sharedParameter = this.playerConfig.sharedParameters?.find(v => v.key === parameter.key);
    if (sharedParameter) {
      this.playerConfig.sharedParameters?.splice(this.playerConfig.sharedParameters?.indexOf(sharedParameter), 1);
    }
    this.playerConfig.sharedParameters?.push(parameter);
    this.veronaPostService.sendVopStateChangedNotification({
      playerState: this.playerConfig
    })
  }

  nextScene() {
    // console.log("nextScene");
    this.currentSceneIndex.update(v => v + 1);
    if (this.currentSceneIndex() < this.unitData.scenes.length) {
      this.sceneData.set(this.unitData.scenes[this.currentSceneIndex()]);
    } else {
      this.veronaPostService.sendVopUnitNavigationRequestedNotification('next');
    }
  }

  getAnimationSrc(animationId: string): string {
    // console.log("getAnimationSrc", animationId);
    const animationSrc = this.unitData.animations.find((a) => a.id === animationId);
    if (animationSrc?.animationSrc) {
      return animationSrc?.animationSrc as string;
    } else {
      if (animationSrc?.animations && animationSrc?.parameterId) {
        const parameter = this.playerConfig.sharedParameters?.find(v => v.key === animationSrc.parameterId)?.value || undefined;
        if (parameter) {
          // console.log('ani', animationSrc);
          return animationSrc.animations.find(v => v.id === parameter)?.animationSrc || '';
        } else {
          return animationSrc.animations[0].animationSrc || '';
        }
      }
    }
    const animationSrcExternal = this.externalUnitData.animations.find((a) => a.id === animationId);
    if (animationSrcExternal?.animationSrc) {
      return animationSrcExternal?.animationSrc as string;
    } else {
      if (animationSrcExternal?.animations && animationSrcExternal?.parameterId) {
        const parameter = this.playerConfig.sharedParameters?.find(v => v.key === animationSrcExternal.parameterId)?.value || undefined;
        if (parameter) {
          // console.log('ani', animationSrcExternal);
          return animationSrcExternal.animations.find(v => v.id === parameter)?.animationSrc || '';
        } else {
          return animationSrcExternal.animations[0].animationSrc || '';
        }
      }
    }
    return '';
  }
}
