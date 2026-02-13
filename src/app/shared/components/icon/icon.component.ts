import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../core/interfaces/icon/Icon';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class IconComponent {
  @Input() icon?: Icon;

  get ngZorroIcon(): string {
    return this.icon?.icon as string;
  }

  get stringIcon(): string {
    return this.icon?.icon as string;
  }

  get svgTemplate(): TemplateRef<any> {
    return this.icon?.icon as TemplateRef<any>;
  }

  defaultClass() {
    if (this.icon?.type === 'material') {
      return 'material-symbols-outlined ' + this.icon?.class;
    }
    return '';
  }
}
