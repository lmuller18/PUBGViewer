import { createSelector } from "@ngrx/store";
import * as fromViewer from "../reducers";
import * as fromMatch from "../reducers/match.reducer";

export const getMatchState = createSelector(
  fromViewer.getViewerState,
  (state: fromViewer.ViewerState) => state.match
);

export const getMatch = createSelector(getMatchState, fromMatch.getMatch);

export const getMatchLoading = createSelector(
  getMatchState,
  fromMatch.getMatchLoading
);

export const getMatchLoaded = createSelector(
  getMatchState,
  fromMatch.getMatchLoaded
);
