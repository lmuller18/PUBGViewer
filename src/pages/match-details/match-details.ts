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
  segment = 'details';

  // canvas variables
  canvas: any;
  ctx: any;
  mapName: string;
  zoom: number;
  clear: number;
  extraZoom = 1;
  mapsize = 819200;
  mapScale = 819200 / 2048;
  originX = 0;
  originY = 0;
  zoomCount = 0;

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

  // waits for an element to be visible
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

  // credits for helping with canvas logic go to creator of http://zomgmoz.tv/pubg/
  initMap() {
    // wait for canvas to be visible
    this.onElementReady('map').then(() => {
      // get canvas object
      this.canvas = this.elementRef.nativeElement.ownerDocument.getElementById(
        'map'
      );
      this.ctx = this.canvas.getContext('2d');
      this.ctx.canvas.width = this.canvas.getBoundingClientRect().width;
      this.ctx.canvas.height = this.canvas.getBoundingClientRect().width;

      // init zoom level
      this.zoom = this.canvas.getBoundingClientRect().width / 816000;

      // init what the original size is (used to clear the canvas)
      this.clear = this.mapScale * 2048 * this.zoom;

      // draw map with no touch event
      this.drawMap(null);
    });
  }

  drawMap(event: any) {
    // increase zoom by 1.5x on tap
    this.zoom = this.zoomCount === 0 ? this.zoom : this.zoom * 1.5;

    // get tapped location
    const tappedX = event ? event.center.x - this.canvas.offsetLeft : 0;
    const tappedY = event ? event.center.y - this.canvas.offsetTop : 0;
    this.originX = this.originX + tappedX;
    this.originY = this.originY + tappedY;

    // reset image to normal size if zoom > 5x
    if (this.zoomCount > 5) {
      this.zoomCount = 0;
      this.zoom = this.canvas.getBoundingClientRect().width / 816000;
      this.originX = this.originY = 0;
    }
    // scale image
    const scaledSize = this.mapScale * 2048 * this.zoom;

    // create image
    var img = new Image();
    img.onload = () => {
      // clear off all other points and images
      this.ctx.clearRect(0, 0, this.clear, this.clear);

      // draw and zoom to the tapped area
      this.ctx.drawImage(
        img,
        -this.originX,
        -this.originY,
        scaledSize,
        scaledSize
      );

      // draw points on the map
      this.drawEvents();
    };
    img.src = this.mapName;
    this.zoomCount++;
  }

  drawEvents() {
    let pointSize = 6 / this.zoomCount;
    pointSize = pointSize < 1 ? 1 : pointSize;

    // draw attacker and victim for each kill by teammate
    this.match.team.teammates.forEach((teammate, index) => {
      this.telemetry.teamKills[teammate.stats.name].forEach(kill => {
        const attackX = kill.killer.location.x * this.zoom - this.originX;
        const attackY = kill.killer.location.y * this.zoom - this.originY;
        const victimX = kill.victim.location.x * this.zoom - this.originX;
        const victimY = kill.victim.location.y * this.zoom - this.originY;

        // draw victim location
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(victimX, victimY, pointSize, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();

        // get teammate color from color array
        this.ctx.fillStyle = this.colors[index];
        this.ctx.beginPath();
        this.ctx.arc(attackX, attackY, pointSize, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();

        // draw dashed line between
        this.ctx.setLineDash([5, 3]);
        this.ctx.beginPath();
        this.ctx.moveTo(attackX, attackY);
        this.ctx.lineTo(victimX, victimY);
        this.ctx.stroke();
      });
    });
  }
}
