import { MatchesActionTypes, MatchesActions } from "../actions/matches.actions";

export interface MatchesState {
  matches: Array<any>;
  loading: boolean;
  loaded: boolean;
}

export const initialState: MatchesState = {
  matches: [],
  loading: false,
  loaded: false
};

export function reducer(
  state = initialState,
  action: MatchesActions
): MatchesState {
  switch (action.type) {
    case MatchesActionTypes.LoadMatches: {
      return {
        ...state,
        matches: [],
        loading: true
      };
    }

    case MatchesActionTypes.LoadExternalMatchSuccess: {
      const match = action.payload;
      return {
        ...state,
        matches: [...state.matches, match]
      };
    }

    case MatchesActionTypes.LoadMatchesSuccess: {
      return {
        ...state,
        loading: false,
        loaded: true
      };
    }

    case MatchesActionTypes.LoadMatchesFailure:
    case MatchesActionTypes.LoadExternalMatchFailure: {
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

export const getRawMatches = (state: MatchesState) => state.matches;
export const getMatchesLoading = (state: MatchesState) => state.loading;
export const getMatchesLoaded = (state: MatchesState) => state.loaded;
