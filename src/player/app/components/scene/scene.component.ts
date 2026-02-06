import {
  AfterViewInit, Component, effect, ElementRef, input, output, signal, ViewChild
} from '@angular/core';
import { DotLottie } from '@lottiefiles/dotlottie-web';

@Component({
  selector: 'lottie-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})

export class SceneComponent implements AfterViewInit {
  animationSrc = input.required<string>();
  animationId = input.required<string>();
  autoplay = input<boolean>(true);
  loop = input<boolean>(true);
  loopCount = input<number>(0);
  loopFinished = output<string>();
  completed = output<string>();

  @ViewChild('sceneCanvas', { static: true }) sceneContainer!: ElementRef<HTMLCanvasElement>;
  private _dotLottieScene: DotLottie| null = null;
  animationHidden = signal(true);

  constructor() {
    effect(() => {
      if (this.sceneContainer && this.animationSrc()) {
        console.log('Creating DotLottie scene', this.animationId(), 'with src', this.animationSrc() );
        this._dotLottieScene = new DotLottie({
          canvas: this.sceneContainer.nativeElement,
          autoplay: this.autoplay(),
          loop: this.loop(),
          loopCount: this.loopCount(),
          src: this.animationSrc(),
          renderConfig: {
            autoResize: true,
            devicePixelRatio: 1,
          },
          layout: {
            fit: 'contain',
            align: [0.5, 0.5]
          }
        })
      }
      if (this.autoplay()) this.animationHidden.set(false);
    });
  }

  ngAfterViewInit(): void {
    if (this._dotLottieScene) {
      this._dotLottieScene.addEventListener('loop', ({ loopCount }) => {
        this.loopFinished.emit(this.animationId());
      });
      this._dotLottieScene.addEventListener('complete', () => {
        console.log('Animation completed');
        this.completed.emit(this.animationId());
      });
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
