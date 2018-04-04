import { createSelector } from "@ngrx/store";
import * as fromViewer from "../reducers";
import * as fromPlayer from "../reducers/player.reducer";

export const getPlayerState = createSelector(
  fromViewer.getViewerState,
  (state: fromViewer.ViewerState) => state.player
);

export const getPlayer = createSelector(getPlayerState, fromPlayer.getPlayer);

export const getPlayerLoading = createSelector(
  getPlayerState,
  fromPlayer.getPlayerLoading
);

export const getPlayerLoaded = createSelector(
  getPlayerState,
  fromPlayer.getPlayerLoaded
);
