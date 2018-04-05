import { createSelector } from "@ngrx/store";
import * as fromViewer from "../reducers";
import * as fromMatch from "../reducers/match.reducer";

export const getMatchState = createSelector(
  fromViewer.getViewerState,
  (state: fromViewer.ViewerState) => state.match
);

export const getRawMatches = createSelector(
  getMatchState,
  fromMatch.getRawMatches
);

export const getMatches = createSelector(getRawMatches, (rawMatches: any[]) => {
  const matches: any[] = [];
  rawMatches.forEach(rawMatch => {
    let duration = new Date(null);
    duration.setSeconds(rawMatch.data.attributes.duration);
    matches.push({
      gameMode: rawMatch.data.attributes.gameMode,
      duration: duration.getMinutes() + ":" + duration.getSeconds(),
      included: rawMatch.included
    });
  });
  console.log("formatted matches: ", matches);
  return matches;
});

export const getMatchesLoading = createSelector(
  getMatchState,
  fromMatch.getMatchesLoading
);

export const getMatchesLoaded = createSelector(
  getMatchState,
  fromMatch.getMatchesLoaded
);

export const getLoadedMatches = createSelector(
  getRawMatches,
  getMatchesLoaded,
  (matches: any[], loaded: boolean) => {
    if (loaded) return matches;
    return null;
  }
);
