import { combineReducers } from "redux"
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import * as actions from './actionType';

const persistConfig = {
  key: "root",
  storage,
};

const initialWalletState = {
  user: {
    userAddress: "",
    userBalance: 0,
  },
}

const connectWalletReducer = (config = initialWalletState, action) => {
  switch (action.type) {
    case actions.CONNECT_WALLET:
      return {
        ...config, user: action.user,
      };
    case actions.DISCONNECT_WALLET:
      storage.removeItem('persist:root')
      return {
        ...initialWalletState,
      };
    case actions.TEZOS_INSTANCE:
      return { ...config }
    case actions.CONNECT_WALLET_ERROR:
      return config;
    default:
      return config;
  }
}

const contractStorageReducer = (state = 0, action) => {
  switch (action.type) {
    case actions.SET_VALUE:
      return action.payload;
    default:
      return state;
  }
}

const loadingReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case actions.LOADING:
      return { loading: true };
    case actions.NOT_LOADING:
      return { loading: false };
    default:
      return state;
  }
}

const reducers = combineReducers({
  walletConfig: connectWalletReducer,
  contractStorage: contractStorageReducer,
  loader: loadingReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);
export default persistedReducer;