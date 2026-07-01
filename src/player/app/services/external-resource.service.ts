import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalResourceService {
  externalInitStarted = false;
  externalDataInitialized = new BehaviorSubject<boolean>(this.externalInitStarted);

  initializeExternalData(resourceUrl: string, renderer: Renderer2): void {
    if (!this.externalInitStarted) {
      this.externalInitStarted = true;
      const script = renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = `${parent.location.origin}${resourceUrl}/avatar.json`;
      script.onload = () => {
        this.externalDataInitialized.next(true);
      };
      script.onerror = (message: string) => {
        // console.log('external data not loading', message);
      };
      renderer.appendChild(document.head, script);
    }
  }

  isExternalDataLoaded(): Observable<boolean> {
    return this.externalDataInitialized as Observable<boolean>;
  }
}
