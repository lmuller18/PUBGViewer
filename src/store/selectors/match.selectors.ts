import { createSelector } from '@ngrx/store';
import * as fromViewer from '../reducers';
import * as fromMatch from '../reducers/match.reducer';

export const getMatchState = createSelector(
  fromViewer.getViewerState,
  (state: fromViewer.ViewerState) => state.match
);

export const getMatchTelemetry = createSelector(
  getMatchState,
  fromMatch.getMatchTelemetry
);

export const getMatchTelemetryLoading = createSelector(
  getMatchState,
  fromMatch.getMatchTelemetryLoading
);

export const getMatchTelemetryLoaded = createSelector(
  getMatchState,
  fromMatch.getMatchTelemetryLoaded
);
