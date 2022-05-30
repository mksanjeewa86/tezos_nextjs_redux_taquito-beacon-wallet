import {
  BeaconEvent,
  ColorMode,
  defaultEventCallbacks,
  NetworkType
} from '@airgap/beacon-sdk'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Header } from '../components/Header'
import { fetchContractData, _walletConfig } from '../reducers/walletActions'

export default function Home() {
  const dispatch = useDispatch();
  const [Tezos, setTezos] = useState(
    new TezosToolkit('https://ithacanet.smartpy.io'),
  );
  const [wallet, setWallet] = useState(null);
  const loading = useSelector((state) => {
    return state.loader.loading;
  });
  
  useEffect(() => {
    (async () => {
      const wallet_instance = new BeaconWallet({
        name: 'Template',
        preferredNetwork: NetworkType.ITHACANET,
        colorMode: ColorMode.LIGHT,
        disableDefaultEvents: false,
        eventHandlers: {
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT,
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: (data) => {
              return data.publicKey;
            },
          },
        },
      });
      Tezos.setWalletProvider(wallet_instance);
      const activeAccount = await wallet_instance.client.getActiveAccount();
      if (activeAccount) {
        const userAddress = await wallet_instance.getPKH();
        const balance = await Tezos.tz.getBalance(userAddress);
        dispatch(
          _walletConfig({
            userAddress: userAddress,
            balance: balance.toNumber(),
          }),
        );
      }
      setWallet(wallet_instance);
    })();
  }, [Tezos, dispatch]);

  useEffect(() => {
    dispatch(fetchContractData({ Tezos }));
  }, [Tezos, dispatch]);

  return (
    <div>
      <Header Tezos={Tezos} setTezos={setTezos} wallet={wallet} />
    </div>
  )
}
