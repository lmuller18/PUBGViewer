import * as fromPlayer from "./player.reducer";
import * as fromMatch from "./match.reducer";

import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";

export interface ViewerState {
  player: fromPlayer.PlayerState;
  match: fromMatch.MatchState;
}

export const reducers: ActionReducerMap<ViewerState> = {
  player: fromPlayer.reducer,
  match: fromMatch.reducer
};

export const getViewerState = createFeatureSelector<ViewerState>("viewer");
