import { Action } from "@ngrx/store";

export enum MatchActionTypes {
  LoadMatch = "[Viewer] Load Match",
  LoadMatchSuccess = "[Viewer] Load Match Success",
  LoadMatchFailure = "[Viewer] Load Match Failure"
}

export class LoadMatch implements Action {
  readonly type = MatchActionTypes.LoadMatch;
  constructor(public payload: any) {}
}

export class LoadMatchSuccess implements Action {
  readonly type = MatchActionTypes.LoadMatchSuccess;
  constructor(public payload: any) {}
}

export class LoadMatchFailure implements Action {
  readonly type = MatchActionTypes.LoadMatchFailure;
  constructor(public payload: any) {}
}

export type MatchActions = LoadMatch | LoadMatchSuccess | LoadMatchFailure;
