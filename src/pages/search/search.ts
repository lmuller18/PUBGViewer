import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IonicPage, NavController, ToastController } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import { Player } from "../../providers/providers";
import { MainPage } from "../pages";

@IonicPage()
@Component({
  selector: "page-search",
  templateUrl: "search.html"
})
export class SearchPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type

  searchForm: FormGroup;
  // Our translated text strings
  // private signupErrorString: string;

  constructor(
    public navCtrl: NavController,
    public player: Player,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private formBuilder: FormBuilder
  ) {
    // this.translateService.get("SIGNUP_ERROR").subscribe(value => {
    // this.signupErrorString = value;
    // });
    this.searchForm = this.formBuilder.group({
      player: ["", Validators.required],
      platform: ["", Validators.required],
      region: ["", Validators.required]
    });
  }

  doSignup() {
    console.log(this.searchForm.value);

    this.navCtrl.push(MainPage);

    this.player.search(this.searchForm.value).subscribe(
      resp => {
        this.navCtrl.push(MainPage);

        let toast = this.toastCtrl.create({
          message: "Success",
          duration: 3000,
          position: "top"
        });
        toast.present();
      },
      err => {
        this.navCtrl.push(MainPage);

        // Unable to sign up
        let toast = this.toastCtrl.create({
          message: "Error",
          duration: 3000,
          position: "top"
        });
        toast.present();
      }
    );
    // Attempt to login in through our User service
    // this.user.signup(this.account).subscribe(
    //   resp => {
    //     this.navCtrl.push(MainPage);
    //   },
    //   err => {
    //     this.navCtrl.push(MainPage);

    //     // Unable to sign up
    //     let toast = this.toastCtrl.create({
    //       message: this.signupErrorString,
    //       duration: 3000,
    //       position: "top"
    //     });
    //     toast.present();
    //   }
    // );
  }

  formValid() {
    return this.searchForm.dirty && this.searchForm.valid;
  }
}
