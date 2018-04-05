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
      console.log("Matches: ", matches);
      if (matches) {
        this.matches = matches;
      }
    });
  }
}
//   /**
//    * The view loaded, let's query our items for the list
//    */
//   ionViewDidLoad() {
//   }

//   /**
//    * Prompt the user to add a new item. This shows our ItemCreatePage in a
//    * modal and then adds the new item to our data source if the user created one.
//    */
//   addItem() {
//     let addModal = this.modalCtrl.create('ItemCreatePage');
//     addModal.onDidDismiss(item => {
//       if (item) {
//         this.items.add(item);
//       }
//     })
//     addModal.present();
//   }

//   /**
//    * Delete an item from the list of items.
//    */
//   deleteItem(item) {
//     this.items.delete(item);
//   }

//   /**
//    * Navigate to the detail page for this item.
//    */
//   openItem(item: Item) {
//     this.navCtrl.push('ItemDetailPage', {
//       item: item
//     });
//   }
// }
