export interface ScriptData {
  scene: string,
  loop: boolean,
  loopCount?: number,
  animationIds: string[],
  audioSrc?: string,
  waitForAudioToFinish?: boolean
}

export interface AnimationData {
  id: string,
  animationSrc: string,
  loop?: boolean,
  loopCount?: number
}

export interface SceneData {
  cockpitSrc: string,
  backgroundIds?: string[],
  foregroundIds?: string[],
  script: ScriptData[],
  interaction?: boolean,
  interactionType?: string,
  interactionParameters?: InteractionData
}

export interface UnitData {
  backgroundColor: string,
  scenes: SceneData[],
  animations: AnimationData[]
}

export interface InteractionOptions {
  imageSrc: string,
  label?: string,
  value: string
}

export interface InteractionData {
  sharedId: string,
  options: InteractionOptions[]
}

export enum AudioPlayerStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED',
  READY = 'READY',
  EMPTY = 'EMPTY',
  NO_SOURCE = 'NO_SOURCE'
}

