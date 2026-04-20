import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Note: Testing static methods that interact with the DOM (creating input elements, FileReader)
  // is tricky in a pure unit test environment without mocking DOM APIs.
  // We can verify the static methods exist.

  it('should have static load methods', () => {
    expect(FileService.loadFile).toBeDefined();
    expect(FileService.loadImage).toBeDefined();
    expect(FileService.loadAudio).toBeDefined();
    expect(FileService.loadVideo).toBeDefined();
  });
});
