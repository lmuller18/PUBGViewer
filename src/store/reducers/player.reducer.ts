import { PlayerActionTypes, PlayerActions } from "../actions/player.actions";

export interface PlayerState {
  player: any;
  notFound: boolean;
  loading: boolean;
  loaded: boolean;
}

export const initialState: PlayerState = {
  player: undefined,
  notFound: false,
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
        notFound: false,
        loading: true
      };
    }

    case PlayerActionTypes.LoadPlayerSuccess: {
      const player = action.payload;
      return {
        ...state,
        player,
        notFound: false,
        loading: false,
        loaded: true
      };
    }

    case PlayerActionTypes.LoadPlayerFailure: {
      return {
        ...state,
        notFound: true,
        loaded: true,
        loading: false
      };
    }

    default:
      return state;
  }
}

export const getPlayer = (state: PlayerState) => state.player;
export const getPlayerNotFound = (state: PlayerState) => state.notFound;
export const getPlayerLoading = (state: PlayerState) => state.loading;
export const getPlayerLoaded = (state: PlayerState) => state.loaded;
