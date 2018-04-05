import { Component } from "@angular/core";
import { IonicPage, NavController, ToastController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string; password: string } = {
    email: "test@example.com",
    password: "test"
  };

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController
  ) {}

  // Attempt to login in through our User service
  doLogin() {}
}
