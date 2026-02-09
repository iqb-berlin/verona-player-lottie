import {
  AfterViewInit, Component, effect, ElementRef, input, output, signal, ViewChild
} from '@angular/core';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { AnimationData } from '../../models/unit.model';

@Component({
  selector: 'lottie-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})

export class SceneComponent implements AfterViewInit {
  animationData = input.required<AnimationData>();
  autoplay = input<boolean>(true);
  loopFinished = output<string>();
  completed = output<string>();

  @ViewChild('sceneCanvas', { static: true }) sceneContainer!: ElementRef<HTMLCanvasElement>;
  private _dotLottieScene: DotLottie| null = null;
  animationHidden = signal(true);

  constructor() {
    effect(() => {
      if (this.sceneContainer && this.animationData().animationSrc) {
        if (this._dotLottieScene) {
          this._dotLottieScene.destroy();
          this.removeListeners();
        }
        this._dotLottieScene = new DotLottie({
          canvas: this.sceneContainer.nativeElement,
          autoplay: this.autoplay(),
          loop: this.animationData().loop || true,
          loopCount: this.animationData().loopCount || 0,
          src: this.animationData().animationSrc,
          renderConfig: {
            autoResize: true,
            devicePixelRatio: 1,
          },
          layout: {
            fit: 'contain',
            align: [0.5, 0.5]
          }
        });
        this.addListeners();
      }
      if (this.autoplay()) this.animationHidden.set(false);
    });
  }

  ngAfterViewInit() {
    this.addListeners();
  }

  addListeners(): void {
    if (this._dotLottieScene) {
      this._dotLottieScene.addEventListener('loop', ({ loopCount }) => {
        this.loopFinished.emit(this.animationData().id);
      });
      this._dotLottieScene.addEventListener('complete', () => {
        console.log('Animation completed');
        this.completed.emit(this.animationData().id);
      });
    }
  }

  removeListeners(): void {
    if (this._dotLottieScene) {
      this._dotLottieScene.removeEventListener('loop', ({ loopCount }) => {});
      this._dotLottieScene.removeEventListener('complete', () => {});
    }
  }

  play() {
    this.animationHidden.set(false);
    this._dotLottieScene?.play();
  }

  stop() {
    this._dotLottieScene?.stop();
  }

  hide() {
    this.animationHidden.set(true);
  }
}
