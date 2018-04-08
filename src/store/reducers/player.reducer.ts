import { PlayerActionTypes, PlayerActions } from "../actions/player.actions";

export interface PlayerState {
  player: any;
  loading: boolean;
  loaded: boolean;
}

export const initialState: PlayerState = {
  player: undefined,
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

    default:
      return state;
  }
}

export const getPlayer = (state: PlayerState) => state.player;
export const getPlayerLoading = (state: PlayerState) => state.loading;
export const getPlayerLoaded = (state: PlayerState) => state.loaded;
