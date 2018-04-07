import { MatchActionTypes, MatchActions } from "../actions/match.actions";

export interface MatchState {
  match: any;
  loading: boolean;
  loaded: boolean;
}

export const initialState: MatchState = {
  match: undefined,
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
        match: undefined,
        loading: true
      };
    }

    case MatchActionTypes.LoadMatchSuccess: {
      const match = action.payload;
      return {
        ...state,
        match,
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

export const getMatch = (state: MatchState) => state.match;
export const getMatchLoading = (state: MatchState) => state.loading;
export const getMatchLoaded = (state: MatchState) => state.loaded;
