export interface SceneData {
  scene: string;
  loop: boolean;
  loopCount?: number;
  animationIds: string[];
  audioSrc?: string,
  waitForLoopToFinish?: boolean
}

export interface AnimationData {
  id: string;
  animationSrc: string;
  loop?: boolean;
  loopCount?: number;
}

export interface UnitData {
  backgroundColor: string;
  cockpitSrc: string;
  backgroundSrc: string;
  infiniteLoops: string[];
  script: SceneData[],
  animations: AnimationData[]
}

export enum AudioPlayerStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED',
  READY = 'READY',
  EMPTY = 'EMPTY',
  NO_SOURCE = 'NO_SOURCE'
}

