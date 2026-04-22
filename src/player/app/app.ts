import { Component, inject, OnInit, signal } from '@angular/core';

import { VeronaPostService } from '../../verona/player/verona-post.service';
import { VeronaSubscriptionService } from '../../verona/player/verona-subscription.service';

import { StandaloneMenuComponent, SceneComponent } from './components';
import { UnitService } from './services/unit.service';
import {
  VeronaMetaData,
  VopPlayerConfigChangedNotification,
  VopStartCommand
} from '../../verona/verona.interfaces';
import { AnimationService } from './services/animation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    StandaloneMenuComponent,
    SceneComponent
  ],
  styleUrl: './app.css'
})

export class App implements OnInit {
  isStandalone = false;

  unitService = inject(UnitService);
  animationService = inject(AnimationService);
  veronaPostService = inject(VeronaPostService);
  veronaSubscriptionService = inject(VeronaSubscriptionService);

  protected readonly title = signal('verona-player-lottie');

  ngOnInit() {
    this.isStandalone = window === window.parent;
    this.initializeEvents();
  }

  initializeEvents() {
    this.veronaPostService.sendVopReadyNotification({} as VeronaMetaData)
    this.veronaSubscriptionService.vopStartCommand.subscribe( (vopStartCommand: VopStartCommand) => {
      console.log('VopStartCommand', vopStartCommand);
      if (vopStartCommand.sessionId) {
        this.veronaPostService.sessionID = vopStartCommand.sessionId;
        if (vopStartCommand.unitDefinition) {
          const unitDefinition = vopStartCommand.unitDefinition ? JSON.parse(vopStartCommand.unitDefinition) : {};
          this.unitService.setNewData(unitDefinition);
        }
      }
      if (vopStartCommand.playerConfig) {
        this.unitService.setPlayerConfig(vopStartCommand.playerConfig);
      }
    });
    this.veronaSubscriptionService.vopPlayerConfigChangedNotification.subscribe(
      (vopPlayerConfig: VopPlayerConfigChangedNotification) => {
      console.log('VopPlayerConfigChangedNotification', vopPlayerConfig);
      if (vopPlayerConfig.sessionId && vopPlayerConfig.sessionId === this.veronaPostService.sessionID) {
        if (vopPlayerConfig.playerConfig) {
          this.unitService.setPlayerConfig(vopPlayerConfig.playerConfig);
        }
      }
    });
  }
}
