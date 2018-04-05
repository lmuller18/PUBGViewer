import { Component, OnInit } from "@angular/core";
import { IonicPage, ToastController } from "ionic-angular";

import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";
import * as fromViewer from "../../store";
import { filter } from "rxjs/operators";

@IonicPage()
@Component({
  selector: "page-list-master",
  templateUrl: "list-master.html"
})
export class ListMasterPage implements OnInit {
  // currentItems: Item[];
  player$: Observable<any>;
  player: any;
  matches$: Observable<any[]>;
  matches: any[];

  constructor(
    public toastCtrl: ToastController,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.player$ = this.store.pipe(
      select(fromViewer.getPlayer),
      filter(Boolean)
    );
    this.matches$ = this.store.pipe(select(fromViewer.getMatches));
  }

  ngOnInit() {
    this.matches$.subscribe((matches: any[]) => {
      if (matches) {
        this.matches = matches;
      }
    });
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
