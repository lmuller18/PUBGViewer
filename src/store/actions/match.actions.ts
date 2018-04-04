import { Action } from "@ngrx/store";

export enum MatchActionTypes {
  LoadMatches = "[Viewer] Load Matches",
  LoadMatchesSuccess = "[Viewer] Load Matches Success",
  LoadMatchesFailure = "[Viewer] Load Matches Failure",

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

export class LoadMatches implements Action {
  readonly type = MatchActionTypes.LoadMatches;
  constructor(public payload: any) {}
}

export class LoadMatchesSuccess implements Action {
  readonly type = MatchActionTypes.LoadMatchesSuccess;
  constructor(public payload: any) {}
}

export class LoadMatchesFailure implements Action {
  readonly type = MatchActionTypes.LoadMatchesFailure;
  constructor(public payload: any) {}
}

export type MatchActions =
  | LoadMatch
  | LoadMatchSuccess
  | LoadMatchFailure
  | LoadMatches
  | LoadMatchesSuccess
  | LoadMatchesFailure;
