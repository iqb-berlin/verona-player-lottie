import { Component, inject, OnInit, signal } from '@angular/core';

import { StandaloneMenuComponent, StartComponent } from './components';
import { UnitService } from './services/unit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    StandaloneMenuComponent,
    StartComponent
  ],
  styleUrl: './app.css'
})

export class App implements OnInit {
  isStandalone = false;

  unitService = inject(UnitService);
  protected readonly title = signal('verona-player-lottie');

  ngOnInit() {
    this.isStandalone = window === window.parent;
  }
}
