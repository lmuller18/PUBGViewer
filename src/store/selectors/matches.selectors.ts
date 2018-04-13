import { createSelector } from '@ngrx/store';
import * as fromViewer from '../reducers';
import * as fromMatches from '../reducers/matches.reducer';

export const getMatchesState = createSelector(
  fromViewer.getViewerState,
  (state: fromViewer.ViewerState) => state.matches
);

export const getMatches = createSelector(
  getMatchesState,
  fromMatches.getRawMatches
);

export const getMatchesLoading = createSelector(
  getMatchesState,
  fromMatches.getMatchesLoading
);

export const getMatchesLoaded = createSelector(
  getMatchesState,
  fromMatches.getMatchesLoaded
);
