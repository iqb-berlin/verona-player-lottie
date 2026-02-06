import { Injectable, signal } from '@angular/core';
import { UnitData } from '../models/unit.model';

@Injectable({
  providedIn: 'root'
})

export class UnitService {
  serviceName = 'UnitService';
  isUnitLoaded = signal<boolean>(false);

  unitData: UnitData = {
    backgroundColor: '#000000',
    cockpitSrc: '',
    backgroundSrc: '',
    infiniteLoops: [],
    script: [],
    animations: []
  };

  resetData() {
    this.unitData.backgroundColor = '#000000';
    this.unitData.cockpitSrc = '';
    this.unitData.backgroundSrc = '';
    this.unitData.infiniteLoops = [];
    this.unitData.script = [];
    this.unitData.animations = [];
  }

  setNewData(data: any) {
    console.log(this.serviceName, 'setNewData', data);
    this.resetData();
    const unitData = data as UnitData;

    if (unitData.backgroundColor) this.unitData.backgroundColor = unitData.backgroundColor;
    if (unitData.cockpitSrc) this.unitData.cockpitSrc = unitData.cockpitSrc;
    if (unitData.backgroundSrc) this.unitData.backgroundSrc = unitData.backgroundSrc;
    if (unitData.infiniteLoops) this.unitData.infiniteLoops = unitData.infiniteLoops;
    if (unitData.script) this.unitData.script = unitData.script;
    if (unitData.animations) this.unitData.animations = unitData.animations;

    this.isUnitLoaded.set(true);
  }

  getCockpitSrc() {
    return this.unitData.cockpitSrc || '';
  }

  getBackgroundSrc() {
    return this.unitData.backgroundSrc || '';
  }

  getAnimationSrc(animationId: string): string {
    const animationSrc = this.unitData.animations.find((a) => a.id === animationId);
    console.log(this.serviceName, 'getAnimationSrc', animationId, animationSrc);
    return animationSrc?.animationSrc || '';
  }
}
