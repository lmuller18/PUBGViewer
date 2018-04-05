import { MatchActionTypes, MatchActions } from "../actions/match.actions";

export interface MatchState {
  matches: Array<any>;
  rawMatches: Array<any>;
  loading: boolean;
  loaded: boolean;
}

export const initialState: MatchState = {
  matches: [],
  rawMatches: [],
  loading: false,
  loaded: false
};

export function reducer(
  state = initialState,
  action: MatchActions
): MatchState {
  switch (action.type) {
    case MatchActionTypes.LoadMatches: {
      return {
        ...state,
        matches: [],
        rawMatches: [],
        loading: true
      };
    }

    case MatchActionTypes.LoadMatchSuccess: {
      const match = action.payload;
      return {
        ...state,
        rawMatches: [...state.rawMatches, match]
      };
    }

    case MatchActionTypes.LoadMatchesSuccess: {
      const doneMatches = [...state.rawMatches];
      return {
        ...state,
        matches: doneMatches,
        rawMatches: [],
        loading: false,
        loaded: true
      };
    }

    case MatchActionTypes.LoadMatchesFailure:
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

export const getRawMatches = (state: MatchState) => state.matches;
export const getMatchesLoading = (state: MatchState) => state.loading;
export const getMatchesLoaded = (state: MatchState) => state.loaded;
