import React, { useState, useEffect } from 'react'
import '../App.css'
import { transferFunds } from '../utils/transferFunds'
import { owner2Sign } from '../utils/owner2Sign'
import { getBalanceForAddress } from '../utils/getBalanceForAddress'
import Card from './Card'
import Header from './Header'
import BalanceCard from './BalanceCard'
import './Wallet.css'
import { useSafeSdk } from './SafeContext'

const TransferFunds = ({ safeSdk1 }) => {
  const [recipient, setRecipient] = useState('')
  const [sdk, setSdk] = useState(null)
  const [owner1Sign, setOwner1Sign] = useState(null)
  const [owner2SignTx, setOwner2SignTx] = useState(null)
  const [buttonClick, setButtonClick] = useState(false)
  const [afterBalance, setAfterBalance] = useState('')

  const { sdk: safeSdk, userAddr } = useSafeSdk() // Use the useSafeSdk hook

  const handleTransferFunds = async () => {
    setButtonClick(true)

    const result = await transferFunds(recipient, sdk, userAddr)

    setOwner1Sign(result)
    setButtonClick(false)
    const result2 = await owner2Sign(recipient, sdk, userAddr)
    setOwner2SignTx(result2)

    const receiverAfterBal = await getBalanceForAddress(recipient)
    console.log('balance is:', receiverAfterBal)
    setAfterBalance(receiverAfterBal)
  }

  useEffect(() => {
    setSdk(safeSdk)
  }, [safeSdk])

  return (
    <div className="main-container">
      <div className="wallet-container">
        {' '}
        <Header />
      </div>
      <div style={{ margin: '2rem 2rem 0rem' }}>
        <div className="input-button">
          {' '}
          <label htmlFor="recipient" style={{ marginTop: '1rem' }}>
            Recipient Address:
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient address"
            className="input-recipient"
          />
          <button onClick={() => handleTransferFunds()}>Transfer Funds</button>
        </div>{' '}
      </div>
      {buttonClick ? (
        <div className="center-container">
          <div className="spin-loader" data-testid={'spin-loader'}></div>
        </div>
      ) : (
        <>
          {owner1Sign && <Card ownerData={owner1Sign} />}
          {owner2SignTx && <Card ownerData={owner2SignTx} />}
          {afterBalance && (
            <BalanceCard
              recipient={recipient}
              afterBalance={afterBalance}
              txReceipt={owner2SignTx.txReceipt}
            />
          )}
        </>
      )}
    </div>
  )
}

export default TransferFunds
