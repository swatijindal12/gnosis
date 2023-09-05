import React from 'react'
import { useState, useEffect } from 'react'
import Header from './Header'
import './Wallet.css'
import { walletCreation } from '../utils/walletCreation'
import { useNavigate } from 'react-router-dom'
import { useSafeSdk } from './SafeContext'
import AddOwner from './AddOwner'
const ethers = require('ethers')

const Wallet = () => {
  const [data, setData] = useState(null)
  const [txURL, setTxURL] = useState('')
  const [safeTx, setSafeTx] = useState('')
  const [success, setSuccess] = useState(false)
  const [buttonClick, setButtonClick] = useState(false)
  const { setSafeSdk, userAddr, threshold } = useSafeSdk() // Use the useSafeSdk hook
  const [address, setAddress] = useState('')
  const [metamaskBtn, setMetamaskBtn] = useState(false)
  const [metamaskSigner, setMetamaskSigner] = useState('')

  const handleWalletCreate = async () => {
    setButtonClick(true)
    console.log('Wallet Creation starts')
    console.log('USer address is', userAddr)
    console.log('threshold value is:', threshold)
    try {
      const result = await walletCreation(metamaskSigner, userAddr, threshold)
      console.log('Data are :', result)
      setTxURL(result.txURL)
      setSafeTx(result.safeTxURL)
      setData(result.safeSdk)
      setSuccess(true)

      setSafeSdk(result.safeSdk)
      // Set a flag in localStorage to indicate that the wallet has been created
      localStorage.setItem('walletCreated', 'true')
    } catch (error) {
      console.error(error)
      console.log('Error: ' + error.message)
    }
    setButtonClick(false)
  }

  const handleMetamask = () => {
    console.log('Inside metamask button')

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    console.log('first provider is:', provider)
    if (provider) {
      const signer = provider.getSigner()
      setMetamaskSigner(signer)
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((res) => setAddress(res[0]))
      setMetamaskBtn(true)
    } else {
      alert('install metamask extension!!')
    }
    console.log('address is:', address)
    // setMetamaskBtn(false)
  }

  const navigate = useNavigate()

  const handleSubmit = () => {
    navigate(`/transfer-funds/${data}`)
  }

  // Check if the wallet has already been created in a previous session
  useEffect(() => {
    const walletCreated = localStorage.getItem('walletCreated')
    if (walletCreated === 'true') {
      setSuccess(true)
    }
    setSuccess(false)
  }, [])

  return (
    <>
      <div className="wallet-container">
        <Header />
        <button onClick={handleMetamask} className="safe-account">
          Connect to wallet
        </button>
        <button onClick={handleWalletCreate} className="safe-account">
          Create Safe Account
        </button>
      </div>
      <div>
        {metamaskBtn && (
          <AddOwner address={address} onCreateSafe={handleWalletCreate} />
        )}
      </div>
      <div>
        {success ? (
          <div className="successfully-create">
            <p style={{ fontSize: '2rem', color: 'green' }}>
              Wallet created successfully. Click the links below:
            </p>
            <a href={txURL} target="_blank">
              Etherscan Transaction
            </a>
            <br />
            <br />
            <a href={safeTx} target="_blank">
              Safe Transaction
            </a>
            <div style={{ marginTop: '2rem' }}>
              <button onClick={() => handleSubmit()}>Transfer Funds</button>
            </div>
            <br />
          </div>
        ) : (
          buttonClick && (
            <div className="center-container">
              <div className="spin-loader" data-testid={'spin-loader'}></div>
            </div>
          )
        )}
      </div>
    </>
  )
}

export default Wallet
