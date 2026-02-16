import { TestBed } from '@angular/core/testing';
import { UnitService } from './unit.service';
import { UnitData } from '../models/unit.model';

describe('UnitService', () => {
  let service: UnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default values initially', () => {
    expect(service.isUnitLoaded()).toBe(false);
    expect(service.unitData.backgroundColor).toBe('#000000');
    expect(service.unitData.cockpitSrc).toBe('');
    expect(service.unitData.backgroundSrc).toBe('');
    expect(service.unitData.infiniteLoops).toEqual([]);
    expect(service.unitData.script).toEqual([]);
    expect(service.unitData.animations).toEqual([]);
  });

  it('should reset data correctly', () => {
    service.unitData.backgroundColor = '#ffffff';
    service.unitData.cockpitSrc = 'cockpit.png';
    service.unitData.backgroundSrc = 'bg.png';
    service.unitData.infiniteLoops = ['loop1'];
    service.unitData.script = [{ scene: '1', loop: false, animationIds: [] }];
    service.unitData.animations = [{ id: '1', animationSrc: 'anim1.json' }];

    service.resetData();

    expect(service.unitData.backgroundColor).toBe('#000000');
    expect(service.unitData.cockpitSrc).toBe('');
    expect(service.unitData.backgroundSrc).toBe('');
    expect(service.unitData.infiniteLoops).toEqual([]);
    expect(service.unitData.script).toEqual([]);
    expect(service.unitData.animations).toEqual([]);
  });

  it('should set new data correctly', () => {
    const newData: UnitData = {
      backgroundColor: '#123456',
      cockpitSrc: 'new-cockpit.png',
      backgroundSrc: 'new-bg.png',
      infiniteLoops: ['loopA'],
      script: [{ scene: 'start', loop: true, animationIds: ['animA'] }],
      animations: [{ id: 'animA', animationSrc: 'data:json' }]
    };

    service.setNewData(newData);

    expect(service.unitData.backgroundColor).toBe('#123456');
    expect(service.unitData.cockpitSrc).toBe('new-cockpit.png');
    expect(service.unitData.backgroundSrc).toBe('new-bg.png');
    expect(service.unitData.infiniteLoops).toEqual(['loopA']);
    expect(service.unitData.script).toEqual(newData.script);
    expect(service.unitData.animations).toEqual(newData.animations);
    expect(service.isUnitLoaded()).toBe(true);
  });

  it('should get cockpit src', () => {
    service.unitData.cockpitSrc = 'test-cockpit.png';
    expect(service.getCockpitSrc()).toBe('test-cockpit.png');
    service.unitData.cockpitSrc = '';
    expect(service.getCockpitSrc()).toBe('');
  });

  it('should get background src', () => {
    service.unitData.backgroundSrc = 'test-bg.png';
    expect(service.getBackgroundSrc()).toBe('test-bg.png');
    service.unitData.backgroundSrc = '';
    expect(service.getBackgroundSrc()).toBe('');
  });

  it('should get animation src by id', () => {
    service.unitData.animations = [
      { id: 'anim1', animationSrc: 'src1' },
      { id: 'anim2', animationSrc: 'src2' }
    ];

    expect(service.getAnimationSrc('anim1')).toBe('src1');
    expect(service.getAnimationSrc('anim2')).toBe('src2');
    expect(service.getAnimationSrc('non-existent')).toBe('');
  });
});
