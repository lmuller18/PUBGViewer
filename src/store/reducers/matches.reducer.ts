import { MatchesActionTypes, MatchesActions } from "../actions/matches.actions";

export interface MatchesState {
  matches: Array<any>;
  rawMatches: Array<any>;
  loading: boolean;
  loaded: boolean;
}

export const initialState: MatchesState = {
  matches: [],
  rawMatches: [],
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
        rawMatches: [],
        loading: true
      };
    }

    case MatchesActionTypes.LoadExternalMatchSuccess: {
      const match = action.payload;
      return {
        ...state,
        rawMatches: [...state.rawMatches, match]
      };
    }

    case MatchesActionTypes.LoadMatchesSuccess: {
      const doneMatches = [...state.rawMatches];
      return {
        ...state,
        matches: doneMatches,
        rawMatches: [],
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
