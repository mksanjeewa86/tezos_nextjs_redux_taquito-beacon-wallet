import { NetworkType } from "@airgap/beacon-sdk";
import { TezosToolkit } from "@taquito/taquito";
import config from '../utils/config';
import * as actions from './actionType';

export const connectWallet = ({ wallet, Tezos }) => {
  return async (dispatch) => {
    try {
      var payload = {};
      Tezos.setWalletProvider(wallet)
      const activeAccount = await wallet.client.getActiveAccount();
      if (!activeAccount) {
        await wallet.requestPermissions({
          network: {
            type: NetworkType.ITHACANET,
            rpcUrl: "https://ithacanet.smartpy.io"
          }
        });
      }
      const userAddress = await wallet.getPKH();
      const balance = await Tezos.tz.getBalance(userAddress);
      payload.user = {
        userAddress: userAddress,
        balance: balance.toNumber()
      }
      dispatch(_walletConfig(payload.user));
    } catch (error) {
      console.log(error);
      dispatch({
        type: actions.CONNECT_WALLET_ERROR,
      })
    }
  }
}

export const _walletConfig = (user) => {
  return {
    type: actions.CONNECT_WALLET,
    user,
  }
}

export const disconnectWallet = ({ wallet, setTezos }) => {
  return async (dispatch) => {
    setTezos(new TezosToolkit("https://ithacanet.smartpy.io"));
    dispatch({
      type: actions.DISCONNECT_WALLET,
    });
    if (wallet) {
      await wallet.client.removeAllAccounts();
      await wallet.client.removeAllPeers();
      await wallet.client.destroy();
    }
  };
}

export const fetchContractData = ({ Tezos }) => {
  return async (dispatch, getState) => {
    try {
      const contract = await Tezos.wallet.at(config.contractAddress);
      const storage = await contract.storage();
      dispatch({ type: actions.SET_VALUE, payload: storage.toNumber() });
    } catch (e) {
      //dispatch
      console.log(e);
    }
  }
}
