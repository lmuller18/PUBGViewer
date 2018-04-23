import { Component, OnInit, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import * as fromViewer from '../../store';
import { filter } from 'rxjs/operators';
import { LoadMatch } from '../../store';
@IonicPage()
@Component({
  selector: 'page-match-details',
  templateUrl: 'match-details.html'
})
export class MatchDetailsPage implements OnInit {
  telemetry$: Observable<any>;
  telemetry: any;
  match: any;
  mapsize = 819200;

  canvas: any;
  ctx: any;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    private elementRef: ElementRef,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.match = navParams.get('match');
    const teammateNames = this.match.team.teammates.map(
      teammate => teammate.stats.name
    );
    const teammates = teammateNames.join('|');
    this.store.dispatch(
      new LoadMatch({
        teammates,
        telemUrl: this.match.telemUrl
      })
    );
    this.telemetry$ = this.store.pipe(
      select(fromViewer.getMatchTelemetry),
      filter(Boolean)
    );
  }

  ngOnInit() {
    this.telemetry$.subscribe(telemetry => {
      this.telemetry = telemetry;
    });
    this.canvas = this.elementRef.nativeElement.ownerDocument.getElementById(
      'map'
    );
    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = 250;
    // this.drawMap();
  }

  drawMap() {
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(10, 10, 100, 100);
  }

  drawAttack(attack) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const attackX =
      attack.attacker.location.x / this.mapsize * this.canvas.width;
    const attackY =
      attack.attacker.location.y / this.mapsize * this.canvas.width;
    const victimX = attack.victim.location.x / this.mapsize * this.canvas.width;
    const victimY = attack.victim.location.y / this.mapsize * this.canvas.width;

    console.log(`(${this.canvas.width}, ${this.canvas.height})`);

    console.log(`(${attackX}, ${attackY}`);
    console.log(`(${victimX}, ${victimY}`);

    this.ctx.fillStyle = 'green';
    this.ctx.beginPath();
    this.ctx.arc(attackX, attackY, 5, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(victimX, victimY, 5, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.setLineDash([5, 3]); /*dashes are 5px and spaces are 3px*/
    this.ctx.beginPath();
    this.ctx.moveTo(attackX, attackY);
    this.ctx.lineTo(victimX, victimY);
    this.ctx.stroke();
  }
}
