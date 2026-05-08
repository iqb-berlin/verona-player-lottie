import { bootstrapApplication } from '@angular/platform-browser';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { appConfig } from './app/app.config';
import { App } from './app/app';

DotLottie.setWasmUrl('assets/dotlottie-player.wasm');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
