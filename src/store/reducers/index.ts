import * as fromPlayer from "./player.reducer";
import * as fromMatches from "./matches.reducer";

import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";

export interface ViewerState {
  player: fromPlayer.PlayerState;
  matches: fromMatches.MatchState;
}

export const reducers: ActionReducerMap<ViewerState> = {
  player: fromPlayer.reducer,
  matches: fromMatches.reducer
};

export const getViewerState = createFeatureSelector<ViewerState>("viewer");
