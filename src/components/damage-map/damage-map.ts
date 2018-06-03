import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-damage-map',
  templateUrl: 'damage-map.html'
})
export class DamageMap {
  constructor() {}

  @Input() damageMap: any;
  @Input() playerNumber: any;
  @Input() totalDamage: number;
}
