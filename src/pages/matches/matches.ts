import { Component, OnInit } from "@angular/core";
import { IonicPage, ToastController } from "ionic-angular";

import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";
import * as fromViewer from "../../store";
import { filter } from "rxjs/operators";

@IonicPage()
@Component({
  selector: "page-matches",
  templateUrl: "matches.html"
})
export class MatchesPage implements OnInit {
  player$: Observable<any>;
  player: any;
  matches$: Observable<any[]>;

  constructor(
    public toastCtrl: ToastController,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.player$ = this.store.pipe(
      select(fromViewer.getPlayer),
      filter(Boolean)
    );
    this.matches$ = this.store.pipe(
      select(fromViewer.getMatches),
      filter(Boolean)
    );
  }

  ngOnInit() {
    this.player$.subscribe(player => {
      this.player = player;
    });
  }
}

//   /**
//    * Navigate to the detail page for this item.
//    */
//   openItem(item: Item) {
//     this.navCtrl.push('ItemDetailPage', {
//       item: item
//     });
//   }
// }
