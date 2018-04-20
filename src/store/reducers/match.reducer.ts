import { MatchActionTypes, MatchActions } from '../actions/match.actions';

export interface MatchState {
  matchTelemetry: any;
  loading: boolean;
  loaded: boolean;
}

export const initialState: MatchState = {
  matchTelemetry: undefined,
  loading: false,
  loaded: false
};

export function reducer(
  state = initialState,
  action: MatchActions
): MatchState {
  switch (action.type) {
    case MatchActionTypes.LoadMatch: {
      return {
        ...state,
        matchTelemetry: undefined,
        loading: true
      };
    }

    case MatchActionTypes.LoadMatchSuccess: {
      const matchTelemetry = action.payload;
      return {
        ...state,
        matchTelemetry,
        loading: false,
        loaded: true
      };
    }

    case MatchActionTypes.LoadMatchFailure: {
      return {
        ...state,
        loaded: true,
        loading: false
      };
    }

    default:
      return state;
  }
}

export const getMatchTelemetry = (state: MatchState) => state.matchTelemetry;
export const getMatchTelemetryLoading = (state: MatchState) => state.loading;
export const getMatchTelemetryLoaded = (state: MatchState) => state.loaded;
