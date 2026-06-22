import {
  AfterViewInit, Component, effect, ElementRef, input, output, ViewChild
} from '@angular/core';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { AnimationData } from '../../models/unit.model';

@Component({
  selector: 'lottie-scene',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})

export class AnimationComponent implements AfterViewInit {
  animationData = input<AnimationData >({} as AnimationData);
  autoplay = input<boolean>(true);

  loopFinished = output<string>();
  completed = output<string>();

  @ViewChild('sceneCanvas', { static: true }) sceneContainer!: ElementRef<HTMLCanvasElement>;
  private _dotLottieScene: DotLottie | null = null;
  private _currentAnimationId = '';

  constructor() {

    effect(() => {
      if (this.sceneContainer && this.animationData()?.animationSrc) {
        console.log("AnimationData", this.animationData());

        if (this._currentAnimationId === this.animationData().id) return;

        this._currentAnimationId = this.animationData().id;

        if (this._dotLottieScene) {
          this._dotLottieScene.destroy();
          this.removeListeners();
        }
        this._dotLottieScene = new DotLottie({
          canvas: this.sceneContainer.nativeElement,
          autoplay: this.autoplay(),
          loop: this.animationData()?.loop || false,
          loopCount: this.animationData()?.loopCount || 0,
          src: this.animationData()?.animationSrc as string,
          speed: this.animationData().speed as number || 1,
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
      } else {
        console.log('no animation');
        this._dotLottieScene?.destroy();
      }
    });
  }

  ngAfterViewInit() {
    this.addListeners();
  }

  addListeners(): void {
    if (this._dotLottieScene && this.animationData()?.animationSrc !== undefined) {
      this._dotLottieScene.addEventListener('loop', ({ loopCount }) => {
        console.log('Animation looped');
        // @ts-ignore
        if (this.animationData()?.loop) this.completed.emit(this.animationData().id);
        this.loopFinished.emit(this.animationData().id);
      });
      this._dotLottieScene.addEventListener('complete', () => {
        console.log('Animation completed');
        // @ts-ignore
        this.completed.emit(this.animationData().id);
      });
      this._dotLottieScene.addEventListener('ready', () => console.log('Ready'));
      this._dotLottieScene.addEventListener('load', () => {
        console.log('Loaded');
        // if (this._autoplay) {
        //   this._dotLottieScene?.play();
        // }
      });
      this._dotLottieScene.addEventListener('play', () => console.log('Playing'));
      this._dotLottieScene.addEventListener('pause', () => console.log('Paused'));
    }
  }

  removeListeners(): void {
    if (this._dotLottieScene) {
      this._dotLottieScene.removeEventListener('loop', ({ loopCount }) => {});
      this._dotLottieScene.removeEventListener('complete', () => {});
    }
  }
}
