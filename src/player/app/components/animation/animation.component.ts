import {
  AfterViewInit, Component, effect, ElementRef, input, output, signal, ViewChild
} from '@angular/core';
import { DotLottie } from '@lottiefiles/dotlottie-web';

import { AnimationSources } from '../../models/unit.model';

@Component({
  selector: 'lottie-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})

export class AnimationComponent implements AfterViewInit {
  animationData = input<AnimationSources >({} as AnimationSources);
  next = input<boolean>(false);
  loopFinished = output<string>();
  completed = output<string>();

  currentId = '';
  pendingAnimationData = false;

  @ViewChild('sceneCanvas', { static: true }) sceneContainer!: ElementRef<HTMLCanvasElement>;
  private _dotLottie: DotLottie| null = null;

  constructor() {
    effect(() => {
      if (this.sceneContainer && this.animationData()?.animationSrc) {
        if (this.currentId === this.animationData().id) return;

        this.currentId = this.animationData().id;
        console.log("AnimationData", this.animationData());

        this.pendingAnimationData = true;
        if (!this._dotLottie?.isPlaying) {
          this.loadAnimation();
        }
      } else {
        console.log('no animation');
      }
    });
  }

  loadAnimation() {
    console.log(this.pendingAnimationData);

    if (!this.pendingAnimationData) return;

    console.log('load');

    this.pendingAnimationData = false;

    this._dotLottie?.load({
      autoplay: true,
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
  }

  ngAfterViewInit() {
    this._dotLottie = new DotLottie({
      canvas: this.sceneContainer.nativeElement
    });
    this.addListeners();
  }

  ngOnDestroy() {
    if (this._dotLottie) {
      this._dotLottie.destroy();
      this.removeListeners();
    }
  }

  addListeners(): void {
    if (this._dotLottie) {
      this._dotLottie.addEventListener('loop', ({ loopCount }) => {
        console.log('Loop', this.animationData()?.id);
        if (this.animationData()?.id) {
          this.loopFinished.emit(this.animationData().id);
        }
      });
      this._dotLottie.addEventListener('complete', () => {
        console.log('Complete', this.animationData()?.id);
        if (this.animationData()?.id) {
          this.completed.emit(this.animationData().id);
        }
      });
      this._dotLottie.addEventListener('ready', () => {
        console.log('Ready', this.animationData()?.id);
        if (this.animationData()?.animationSrc) {
          this.pendingAnimationData = true;
          this.loadAnimation();
        }
      });
      this._dotLottie.addEventListener('load', () => console.log('Loaded'));
      this._dotLottie.addEventListener('play', () => console.log('Playing'));
      this._dotLottie.addEventListener('pause', () => console.log('Paused'));
    }
  }

  removeListeners(): void {
    if (this._dotLottie) {
      this._dotLottie.removeEventListener('loop', () => {});
      this._dotLottie.removeEventListener('complete', () => {});
      this._dotLottie.removeEventListener('ready', () => {});
      this._dotLottie.removeEventListener('load', () => {});
      this._dotLottie.removeEventListener('play', () => {});
      this._dotLottie.removeEventListener('pause', () => {});
    }
  }
}
