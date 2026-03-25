import {
  AfterViewInit, Component, effect, ElementRef, input, output, signal, ViewChild
} from '@angular/core';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { AnimationData } from '../../models/unit.model';

@Component({
  selector: 'lottie-scene',
  templateUrl: './script-animation.component.html',
  styleUrls: ['./script-animation.component.scss']
})

export class ScriptAnimationComponent implements AfterViewInit {
  animationData = input.required<AnimationData>();
  autoplay = input<boolean>(true);
  loopFinished = output<string>();
  completed = output<string>();

  @ViewChild('sceneCanvas', { static: true }) sceneContainer!: ElementRef<HTMLCanvasElement>;
  private _dotLottieScene: DotLottie| null = null;
  animationHidden = signal(true);

  constructor() {
    effect(() => {
      console.log("AnimationData", this.animationData());
      if (this.sceneContainer && this.animationData().animationSrc) {
        if (this._dotLottieScene) {
          this._dotLottieScene.destroy();
          this.removeListeners();
        }
        this._dotLottieScene = new DotLottie({
          canvas: this.sceneContainer.nativeElement,
          autoplay: this.autoplay(),
          loop: this.animationData().loop || false,
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
    });
  }

  ngAfterViewInit() {
    this.addListeners();
  }

  addListeners(): void {
    if (this._dotLottieScene) {
      this._dotLottieScene.addEventListener('loop', ({ loopCount }) => {
        console.log('Animation looped');
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
    this._dotLottieScene?.play();
  }

  stop() {
    this._dotLottieScene?.stop();
  }
}
