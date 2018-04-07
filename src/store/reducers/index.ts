import * as fromPlayer from "./player.reducer";
import * as fromMatch from "./match.reducer";
import * as fromMatches from "./matches.reducer";

import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";

export interface ViewerState {
  player: fromPlayer.PlayerState;
  match: fromMatch.MatchState;
  matches: fromMatches.MatchesState;
}

export const reducers: ActionReducerMap<ViewerState> = {
  player: fromPlayer.reducer,
  match: fromMatch.reducer,
  matches: fromMatches.reducer
};

export const getViewerState = createFeatureSelector<ViewerState>("viewer");
