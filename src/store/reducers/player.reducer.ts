import { PlayerActionTypes, PlayerActions } from '../actions/player.actions';

export interface PlayerState {
  player: any;
  details: any;
  seasons: any;
  loading: boolean;
  loaded: boolean;
}

export const initialState: PlayerState = {
  player: undefined,
  details: undefined,
  seasons: undefined,
  loading: false,
  loaded: false
};

export function reducer(
  state = initialState,
  action: PlayerActions
): PlayerState {
  switch (action.type) {
    case PlayerActionTypes.LoadPlayer: {
      return {
        ...state,
        loading: true
      };
    }

    case PlayerActionTypes.LoadPlayerSuccess: {
      const player = action.payload;
      return {
        ...state,
        player,
        loading: false,
        loaded: true
      };
    }

    case PlayerActionTypes.LoadPlayerFailure: {
      return {
        ...state,
        loaded: true,
        loading: false
      };
    }

    case PlayerActionTypes.LoadPlayerDetailsSuccess: {
      const details = action.payload;
      return {
        ...state,
        details
      };
    }

    case PlayerActionTypes.LoadSeasonsSuccess: {
      const seasons = action.payload;
      return {
        ...state,
        seasons
      };
    }

    default:
      return state;
  }
}

export const getPlayer = (state: PlayerState) => state.player;
export const getPlayerLoading = (state: PlayerState) => state.loading;
export const getPlayerLoaded = (state: PlayerState) => state.loaded;
export const getSeasons = (state: PlayerState) => state.seasons;
export const getDetails = (state: PlayerState) => state.details;
