import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;

@Injectable()
export class AuthService {
  private user: any;
  private userPlayer: any;
  private following: any[];
  private usersCollection: AngularFirestoreCollection<any>;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection('users');
    afAuth.authState.subscribe(user => {
      this.user = user;
      if (this.getEmail()) {
        this.usersCollection
          .doc(this.getEmail())
          .valueChanges()
          .subscribe(userPlayer => {
            if (userPlayer) {
              this.userPlayer = userPlayer;
            }
          });
        this.usersCollection
          .doc(this.getEmail())
          .collection('following')
          .valueChanges()
          .subscribe(following => {
            if (following) {
              this.following = following;
            }
          });
      }
    });
  }

  signInWithEmail(credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  getEmail() {
    return this.user && this.user.email;
  }

  getName() {
    return this.user && this.user.displayName;
  }

  getUserPlayer() {
    return this.userPlayer;
  }

  getFollowing() {
    return this.following;
  }

  setUserPlayer(userPlayer: any) {
    this.usersCollection
      .doc(this.getEmail())
      .ref.get()
      .then(snap => {
        return snap.exists
          ? this.updateUserPlayer(userPlayer)
          : this.createUserPlayer(userPlayer);
      })
      .catch(err => console.log(err));
  }

  followPlayer(player: any) {}

  unfollowPlayer(player: any) {}

  createUserPlayer(userPlayer: any) {
    return this.usersCollection.doc(this.getEmail()).set({
      email: this.getEmail(),
      platform: userPlayer.platform,
      region: userPlayer.region,
      playerId: userPlayer.playerId,
      username: userPlayer.username
    });
  }

  updateUserPlayer(userPlayer: any) {
    return this.usersCollection.doc(this.getEmail()).update({
      platform: userPlayer.platform,
      region: userPlayer.region,
      playerId: userPlayer.playerId,
      username: userPlayer.username
    });
  }

  getPhoto() {
    return this.user && this.user.photoURL;
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signInWithGoogle() {
    return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  }

  private oauthSignIn(provider: AuthProvider) {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      return this.afAuth.auth.signInWithRedirect(provider).then(() => {
        return this.afAuth.auth
          .getRedirectResult()
          .then(result => {
            // This gives you a Google Access Token.
            // You can use it to access the Google API.
            // let token = result.credential.accessToken;
            // The signed-in user info.
            // let user = result.user;
          })
          .catch(function(error) {
            // Handle Errors here.
            alert(error.message);
          });
      });
    }
  }
}
