export interface ScriptData {
  scene: string,
  loop: boolean,
  loopCount?: number,
  animationIds: SceneAnimationData[],
  audioSrc?: string,
  waitForAudioToFinish?: boolean
}

export interface AnimationSources {
  id: string,
  slotId: string,
  animationSrc?: string,
  animations?: SharedAnimationData[],
  loop?: boolean,
  loopCount?: number,
  parameterId?: string,
  speed?: number
}

export interface SceneAnimationData {
  slotId: string,
  animationId: string,
  loop?: boolean,
  speed?: number
}

export interface SharedAnimationData {
  id: string,
  animationSrc: string;
}

export interface SceneData {
  scene: string;
  cockpitSrc: string,
  backgroundIds?: string[],
  foregroundIds?: string[],
  script: ScriptData[],
  interaction?: boolean,
  interactionType?: string,
  interactionParameters?: InteractionParameters
}

export interface UnitData {
  backgroundColor: string,
  scenes: SceneData[],
  animations: AnimationSources[]
}

export interface InteractionOptions {
  imageSrc: string,
  label?: string,
  value: string,
  speed?: number
}

export interface InteractionParameters {
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

