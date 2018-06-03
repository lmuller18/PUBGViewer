import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-match-replay',
  templateUrl: 'match-replay.html'
})
export class MatchReplay {
  @Input() telemetry: any;

  // canvas variables
  canvas: any;
  ctx: any;
  @Input() mapName: string;
  zoom: number;
  clear: number;
  extraZoom = 1;
  mapsize = 819200;
  mapScale = 819200 / 2048;
  originX = 0;
  originY = 0;
  zoomCount = 0;

  colors = ['#5394d8', '#e65757', '#f98751', '#40c695', '#986fe5'];

  @Input() match: any;

  constructor(private elementRef: ElementRef) {
    this.initMap();
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
    // let pointSize = 6 / (this.zoomCount / 2);
    // pointSize = pointSize < 1 ? 1 : pointSize;

    // draw attacker and victim for each kill by teammate
    this.match.team.teammates.forEach((teammate, index) => {
      // get color for lines and dots
      // 4th color is what all players over 4 will be assigned in special modes
      const color = index <= 3 ? this.colors[index] : this.colors[4];

      // start the trace at the first point in the movement data
      const prevPoint = this.telemetry.teamMovements[teammate.stats.name][0]
        .character.location;
      const origX = prevPoint.x * this.zoom - this.originX;
      const origY = prevPoint.y * this.zoom - this.originY;

      // mark first point with circle
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(origX, origY, 4, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.fill();

      // start the trace
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(origX, origY);

      this.telemetry.teamMovements[teammate.stats.name].forEach(move => {
        // move to each point in the movement data
        const toPoint = move.character.location;

        const toX = toPoint.x * this.zoom - this.originX;
        const toY = toPoint.y * this.zoom - this.originY;
        this.ctx.lineTo(toX, toY);
      });
      // draw the trace
      this.ctx.stroke();

      // mark kills
      this.telemetry.teamKills[teammate.stats.name].forEach(kill => {
        // get location of player when kill is achieved
        const attackX = kill.killer.location.x * this.zoom - this.originX;
        const attackY = kill.killer.location.y * this.zoom - this.originY;

        var data =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">' +
          `<path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>` +
          '<path d="M0 0h24v24H0z" fill="none"/>' +
          '</svg>';

        data = encodeURIComponent(data);

        var img = new Image();

        img.onload = () => {
          this.ctx.drawImage(img, attackX - 9, attackY - 18);
        };

        img.src = 'data:image/svg+xml,' + data;

        // load map pin icon of appropriate color based on teammateIndex
        // var img = new Image();
        // img.onload = () => {
        // offset by half width and full height to get the pin centered on the true poiint
        // this.ctx.drawImage(img, attackX - 9, attackY - 18);
        // };
        // img.src = `../../assets/img/pubg-assests/map-icons/player-${teammateIndex}-pin.svg`;
      });

      // get last point of movement
      const moveLen = this.telemetry.teamMovements[teammate.stats.name].length;
      const finPoint = this.telemetry.teamMovements[teammate.stats.name][
        moveLen - 1
      ].character.location;
      const finX = finPoint.x * this.zoom - this.originX;
      const finY = finPoint.y * this.zoom - this.originY;

      // mark last point of movement with circle
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(finX, finY, 4, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.fill();
    });
  }
}

/**
 * yep, the conversion is just something like gameX = (canvasX - pan.x) / zoom and other way around canvasX = (gameX * zoom) + pan.x






  const { offsetX: x, offsetY: y } = ev.nativeEvent;

        const gamePt = this.renderer.canvasToGame({
            x: x,
            y: y
        });

        if(ev.deltaY < 0) {
            const newScale = this.renderer.zoom * 1.1;
            this.renderer.zoom = newScale;
            const newPoint = this.renderer.gameToCanvas(gamePt);
            this.setState({
                scaling: newScale,
                translateX: this.state.translateX + (x - newPoint.x),
                translateY: this.state.translateY + (y - newPoint.y)
            });
        }
        else if(ev.deltaY > 0) {
            const newScale = this.renderer.zoom * 0.9;
            this.renderer.zoom = newScale;
            const newPoint = this.renderer.gameToCanvas(gamePt);
            this.setState({
                scaling: newScale,
                translateX: this.state.translateX + (x - newPoint.x),
                translateY: this.state.translateY + (y - newPoint.y)
            });
        }

 */
