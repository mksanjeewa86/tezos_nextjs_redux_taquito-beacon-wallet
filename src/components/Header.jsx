import { useDispatch, useSelector } from 'react-redux'
import { connectWallet, disconnectWallet } from '../reducers/walletActions'

export const Header = ({ Tezos, setTezos, wallet }) => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => {
    return state.walletConfig.user
  })

  const handleConnectWallet = async () => {
    dispatch(connectWallet({ Tezos, wallet }))
  }

  const handleDisconnectWallet = async () => {
    dispatch(disconnectWallet({ wallet, setTezos }))
  }

  return (
    <nav
      style={{
        backgroundColor: 'green',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
      }}
    >
      <div></div>
      <div style={{ backgroundColor: 'blue' }}>
        <button
          onClick={
            selector.userAddress === ''
              ? handleConnectWallet
              : handleDisconnectWallet
          }
        >
          💳&nbsp;
          {selector.userAddress !== ''
            ? selector.userAddress.slice(0, 4) +
              '...' +
              selector.userAddress.slice(
                selector.userAddress.length - 4,
                selector.userAddress.length,
              )
            : 'Connect'}
        </button>
      </div>
    </nav>
  )
}
