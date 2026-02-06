import { Component, inject } from '@angular/core';
import {
  CdkMenu, CdkMenuBar, CdkMenuItem, CdkMenuTrigger
} from '@angular/cdk/menu';
import { Dialog } from '@angular/cdk/dialog';

import { FileService } from '../../services/file.service';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'stars-standalone-menu',
  standalone: true,
  imports: [
    CdkMenuTrigger,
    CdkMenuItem,
    CdkMenuBar,
    CdkMenu
  ],
  template: `
    <div class="stars-standalone-menu">
      <div cdkMenuBar>
        <button class="menu-bar-item" cdkMenuItem [cdkMenuTriggerFor]="file">load</button>
      </div>
      <ng-template #file>
        <div class="menu" cdkMenu>
          <button class="menu-item" cdkMenuItem (cdkMenuItemTriggered)="load()">from file</button>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: 'standalone-menu.component.scss'
})

export class StandaloneMenuComponent {
  dialog = inject(Dialog);
  unitService = inject(UnitService);
  unitDefinitionAsString = '';

  async load(): Promise<void> {
    await FileService.loadFile(['.json', '.voud']).then(fileObject => {
      this.unitDefinitionAsString = fileObject.content;
      this.setNewUnitDefinition();
    });
  }

  private setNewUnitDefinition() {
    const unitDefinition = JSON.parse(this.unitDefinitionAsString);
    this.unitService.setNewData(unitDefinition);
  }
}
