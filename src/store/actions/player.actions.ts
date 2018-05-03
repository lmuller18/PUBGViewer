import { Action } from '@ngrx/store';

export enum PlayerActionTypes {
  LoadPlayer = '[Viewer] Load Player',
  LoadPlayerSuccess = '[Viewer] Load Player Success',
  LoadPlayerFailure = '[Viewer] Load Player Failure',

  LoadSeasons = '[Viewer] Load Season List',
  LoadSeasonsSuccess = '[Viewer] Load Season List Success',
  LoadSeasonsFailure = '[Viewer] Load Season List Failure',

  LoadPlayerDetails = '[Viewer] Load Player Details',
  LoadPlayerDetailsSuccess = '[Viewer] Load Player Details Success',
  LoadPlayerDetailsFailure = '[Viewer] Load Player Details Failure'
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

export class LoadSeasons implements Action {
  readonly type = PlayerActionTypes.LoadSeasons;
  constructor(public payload: any) {}
}

export class LoadSeasonsSuccess implements Action {
  readonly type = PlayerActionTypes.LoadSeasonsSuccess;
  constructor(public payload: any) {}
}

export class LoadSeasonsFailure implements Action {
  readonly type = PlayerActionTypes.LoadSeasonsFailure;
  constructor(public payload: any) {}
}

export class LoadPlayerDetails implements Action {
  readonly type = PlayerActionTypes.LoadPlayerDetails;
  constructor(public payload: any) {}
}

export class LoadPlayerDetailsSuccess implements Action {
  readonly type = PlayerActionTypes.LoadPlayerDetailsSuccess;
  constructor(public payload: any) {}
}

export class LoadPlayerDetailsFailure implements Action {
  readonly type = PlayerActionTypes.LoadPlayerDetailsFailure;
  constructor(public payload: any) {}
}
export type PlayerActions =
  | LoadPlayer
  | LoadPlayerSuccess
  | LoadPlayerFailure
  | LoadPlayerDetails
  | LoadPlayerDetailsSuccess
  | LoadPlayerDetailsFailure
  | LoadSeasons
  | LoadSeasonsSuccess
  | LoadSeasonsFailure;
