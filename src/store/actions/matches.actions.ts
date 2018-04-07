import { Action } from "@ngrx/store";

export enum MatchesActionTypes {
  LoadMatches = "[Viewer] Load Matches",
  LoadMatchesSuccess = "[Viewer] Load Matches Success",
  LoadMatchesFailure = "[Viewer] Load Matches Failure",

  LoadExternalMatch = "[Viewer] Load External Match",
  LoadExternalMatchSuccess = "[Viewer] Load External Match Success",
  LoadExternalMatchFailure = "[Viewer] Load External Match Failure"
}

export class LoadExternalMatch implements Action {
  readonly type = MatchesActionTypes.LoadExternalMatch;
  constructor(public payload: any) {}
}

export class LoadExternalMatchSuccess implements Action {
  readonly type = MatchesActionTypes.LoadExternalMatchSuccess;
  constructor(public payload: any) {}
}

export class LoadExternalMatchFailure implements Action {
  readonly type = MatchesActionTypes.LoadExternalMatchFailure;
  constructor(public payload: any) {}
}

export class LoadMatches implements Action {
  readonly type = MatchesActionTypes.LoadMatches;
  constructor(public payload: any) {}
}

export class LoadMatchesSuccess implements Action {
  readonly type = MatchesActionTypes.LoadMatchesSuccess;
}

export class LoadMatchesFailure implements Action {
  readonly type = MatchesActionTypes.LoadMatchesFailure;
  constructor(public payload: any) {}
}

export type MatchesActions =
  | LoadExternalMatch
  | LoadExternalMatchSuccess
  | LoadExternalMatchFailure
  | LoadMatches
  | LoadMatchesSuccess
  | LoadMatchesFailure;
