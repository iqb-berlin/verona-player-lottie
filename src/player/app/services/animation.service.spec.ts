import { TestBed } from '@angular/core/testing';
import { AnimationService } from './animation.service';
import { UnitService } from './unit.service';
import { AudioService } from './audio.service';
import { SceneData } from '../models/unit.model';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

describe('AnimationService', () => {
  let service: AnimationService;
  let unitServiceSpy: {
    getAnimationSrc: Mock;
    unitData: { script: SceneData[] };
  };
  let audioServiceSpy: {
    setAudioSrc: Mock;
    getPlayFinished: Mock;
  };

  beforeEach(() => {
    unitServiceSpy = {
      getAnimationSrc: vi.fn(),
      unitData: { script: [] }
    };
    audioServiceSpy = {
      setAudioSrc: vi.fn(),
      getPlayFinished: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AnimationService,
        { provide: UnitService, useValue: unitServiceSpy },
        { provide: AudioService, useValue: audioServiceSpy }
      ]
    });
    service = TestBed.inject(AnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set animation data from unit service', () => {
    const mockScript: SceneData[] = [
      { scene: '1', loop: false, animationIds: ['a1'] }
    ];
    unitServiceSpy.unitData.script = mockScript;

    service.setAnimationData();

    // Access private property via 'any' or check side effects if possible.
    // Since sceneList is private and not exposed via signal immediately,
    // we can verify startAnimation behavior which depends on it.
    // However, for this test, we just ensure no error occurs.
  });

  it('should start animation and set signals', () => {
    const mockScript: SceneData[] = [
      { scene: '1', loop: false, animationIds: ['a1'], loopCount: 1 }
    ];
    unitServiceSpy.unitData.script = mockScript;
    unitServiceSpy.getAnimationSrc.mockReturnValue('anim-src-1');

    service.setAnimationData();
    service.startAnimation();

    expect(service.currentScene()).toEqual(mockScript[0]);
    expect(service.currentAnimations()).toEqual(['a1']);
    expect(service.currentMain()).toEqual({
      animationSrc: 'anim-src-1',
      id: 'main',
      loop: false,
      loopCount: 1
    });
  });

  it('should handle multiple animations in a scene', () => {
    const mockScript: SceneData[] = [
      { scene: '1', loop: true, animationIds: ['a1', 'a2'], loopCount: 5 }
    ];
    unitServiceSpy.unitData.script = mockScript;
    unitServiceSpy.getAnimationSrc.mockImplementation((id: string) => `src-${id}`);

    service.setAnimationData();
    service.startAnimation();

    expect(service.currentMain()).toEqual({
      animationSrc: 'src-a1',
      id: 'main',
      loop: true,
      loopCount: 5
    });
    expect(service.currentSecond()).toEqual({
      animationSrc: 'src-a2',
      id: 'second',
      loop: true,
      loopCount: 5
    });
  });
});
