import { Action } from "@ngrx/store";

export enum PlayerActionTypes {
  LoadPlayer = "[Viewer] Load Player",
  LoadPlayerSuccess = "[Viewer] Load Player Success",
  LoadPlayerFailure = "[Viewer] Load Player Failure"
}

export class LoadPlayer implements Action {
  readonly type = PlayerActionTypes.LoadPlayer;
  constructor(public payload: any) {}
}

export class LoadPlayerSuccess implements Action {
  readonly type = PlayerActionTypes.LoadPlayerSuccess;
  constructor(public payload: any) {}
}

export class LoadPlayerFailure implements Action {
  readonly type = PlayerActionTypes.LoadPlayerFailure;
  constructor(public payload: any) {}
}

export type PlayerActions = LoadPlayer | LoadPlayerSuccess | LoadPlayerFailure;
