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
  segment = 'details';
  mapName: string;
  zoom: number;

  colors = ['#ffeb3b', '#304ffe', '#00c853', '#ffab00'];

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    private elementRef: ElementRef,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.match = navParams.get('match');
    const map = this.match.map === 'Desert_Main' ? 'miramar' : 'erangel';
    this.mapName = `../../assets/img/pubg-assests/${map}_minimap_small.jpg`;
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
  }

  onElementReady = $element =>
    new Promise(resolve => {
      const waitForElement = () => {
        if (
          this.elementRef.nativeElement.ownerDocument.getElementById($element)
        ) {
          resolve($element);
        } else {
          window.requestAnimationFrame(waitForElement);
        }
      };
      waitForElement();
    });

  initMap() {
    this.onElementReady('map').then(() => {
      this.canvas = this.elementRef.nativeElement.ownerDocument.getElementById(
        'map'
      );
      this.zoom = this.canvas.getBoundingClientRect().width / 816000;
      const mapScale = 819200 / 2048;
      const scaledSize = mapScale * 2048 * this.zoom;
      this.ctx = this.canvas.getContext('2d');
      this.ctx.canvas.width = this.canvas.getBoundingClientRect().width;
      this.ctx.canvas.height = this.canvas.getBoundingClientRect().width;

      var img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, scaledSize, scaledSize);
        this.drawMap();
      };
      img.src = this.mapName;

      this.drawMap();
    });
  }

  drawMap() {
    this.match.team.teammates.forEach((teammate, index) => {
      this.telemetry.teamKills[teammate.stats.name].forEach(kill => {
        const attackX = kill.killer.location.x * this.zoom;
        const attackY = kill.killer.location.y * this.zoom;
        const victimX = kill.victim.location.x * this.zoom;
        const victimY = kill.victim.location.y * this.zoom;

        this.ctx.fillStyle = this.colors[index];
        this.ctx.beginPath();
        this.ctx.arc(attackX, attackY, 1, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(victimX, victimY, 1, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.setLineDash([5, 3]); /*dashes are 5px and spaces are 3px*/
        this.ctx.beginPath();
        this.ctx.moveTo(attackX, attackY);
        this.ctx.lineTo(victimX, victimY);
        this.ctx.stroke();
      });
    });
  }

  drawAttack(attack) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const attackX =
      attack.attacker.location.x / this.mapsize * this.canvas.width;
    const attackY =
      attack.attacker.location.z / this.mapsize * this.canvas.width;
    const victimX = attack.victim.location.x / this.mapsize * this.canvas.width;
    const victimY = attack.victim.location.z / this.mapsize * this.canvas.width;

    this.ctx.fillStyle = 'green';
    this.ctx.beginPath();
    this.ctx.arc(attackX, attackY, 1, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(victimX, victimY, 1, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.setLineDash([5, 3]); /*dashes are 5px and spaces are 3px*/
    this.ctx.beginPath();
    this.ctx.moveTo(attackX, attackY);
    this.ctx.lineTo(victimX, victimY);
    this.ctx.stroke();
  }
}
