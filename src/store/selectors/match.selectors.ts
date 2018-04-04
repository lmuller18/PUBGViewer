import { createSelector } from "@ngrx/store";
import * as fromViewer from "../reducers";
import * as fromMatch from "../reducers/match.reducer";

export const getMatchState = createSelector(
  fromViewer.getViewerState,
  (state: fromViewer.ViewerState) => state.match
);

export const getMatches = createSelector(getMatchState, fromMatch.getMatches);

export const getMatchesLoading = createSelector(
  getMatchState,
  fromMatch.getMatchesLoading
);

export const getMatchesLoaded = createSelector(
  getMatchState,
  fromMatch.getMatchesLoaded
);
