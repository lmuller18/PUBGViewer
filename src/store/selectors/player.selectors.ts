import { createSelector } from "@ngrx/store";
import * as fromViewer from "../reducers";
import * as fromPlayer from "../reducers/player.reducer";

export const getPlayerState = createSelector(
  fromViewer.getViewerState,
  (state: fromViewer.ViewerState) => state.player
);

export const getRawPlayer = createSelector(
  getPlayerState,
  fromPlayer.getPlayer
);

export const getPlayer = createSelector(getRawPlayer, rawPlayer => {
  console.log("raw player: ", rawPlayer);
  if (!rawPlayer) return undefined;
  const player = {
    name: rawPlayer.attributes.name,
    id: rawPlayer.id,
    matches: rawPlayer.relationships.matches.data
  };
  console.log("formatted player: ", player);
  return player;
});

export const getPlayerLoading = createSelector(
  getPlayerState,
  fromPlayer.getPlayerLoading
);

export const getPlayerLoaded = createSelector(
  getPlayerState,
  fromPlayer.getPlayerLoaded
);
