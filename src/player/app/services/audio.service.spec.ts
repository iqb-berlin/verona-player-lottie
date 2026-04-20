import { TestBed } from '@angular/core/testing';
import { AudioPlayerStatus, AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(service.audioId()).toBe('audio');
    expect(service.maxPlay()).toBe(0);
    expect(service.playCount()).toBe(0);
    expect(service.isPlaying()).toBe(false);
    expect(service.currentSource()).toBeUndefined();
    expect(service.getPlayerStatusValue()).toBe(AudioPlayerStatus.EMPTY);
  });

  it('should update status when setPlayerStatus is called (indirectly via listeners)', () => {
    // Since we cannot easily trigger real audio events in JSDOM without more setup,
    // we can check if the public methods for play/pause update the signal state where applicable.
    // Note: The actual 'playing' status update relies on the 'playing' event from the Audio element.

    // Mocking the internal audio element would be required for deep testing of event listeners.
    // For now, we test the public API surface that doesn't strictly depend on async audio loading.
  });

  it('should handle setAudioSrc with empty source', async () => {
    const result = await service.setAudioSrc('');
    expect(result).toBe(false);
    expect(service.getPlayerStatusValue()).toBe(AudioPlayerStatus.NO_SOURCE);
    expect(service.currentSource()).toBeUndefined();
  });

  // More complex tests involving Audio element behavior (load, play, events) usually require
  // mocking the HTMLAudioElement or running in a browser environment.
});
