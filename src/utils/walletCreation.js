const ethers = require('ethers')
const { SafeFactory, EthersAdapter } = require('@safe-global/protocol-kit')

/**
 * The first signer will sign and propose a transaction to send 0.00000000001 ETH out of the Safe.
 * Then, the second signer will add their own proposal and execute the transaction since it
 * meets the 2 of 3 thresholds.
 */

/**
  A) First signer proposes a transaction
    1. Create transaction: define the amount, destination, and any additional data
    2. Perform an off - chain signature of the transaction before proposing
    3. Submit the transaction and signature to the Safe Transaction Service
  B) Second signer confirms the transaction
    1. Get pending transactions from the Safe service
    2. Perform an off - chain signature of the transaction
    3. Submit the signature to the service
  C) Anyone executes the transaction
    1. In this example, the first signer executes the transaction
    2. Anyone can get the pending transaction from the Safe service
    3. Account executing the transaction pays the gas fee
 */

export const walletCreation = async (metamaskSigner, userAddr, threshold) => {
  // Goerli network RPC URL
  // const RPC_URL =
  //   'https://eth-goerli.g.alchemy.com/v2/Yr4FvM6pDQqSqKoxJQPTtEY2Bwvz-gIR'

  // setup ethers using the RPC_URL
  // const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

  // Initialize signers
  const owner1Signer = metamaskSigner
  const owner1Addr = userAddr[0]

  const owner2 = userAddr[1]

  // initialize ETHERS adapter from owner 1
  const ethAdapterOwner1 = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer,
  })

  console.log('Ethers adapter initialized...')

  // Initialize Safe factory
  const safeFactory = await SafeFactory.create({
    ethAdapter: ethAdapterOwner1,
    isL1SafeMasterCopy: true,
  })
  console.log('Safe factory initialized...')

  const safeAccountConfig = {
    owners: [await owner1Addr, await owner2], //, await owner3Signer],
    threshold: threshold,
  }

  console.log('SAFE ACCOUNT CONFIG', safeAccountConfig.owners)
  /* This Safe is tied to owner 1 because the factory was initialized with
  an adapter that had owner 1 as the signer. */
  const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })

  // Safe address
  const safeAddress = await safeSdk.getAddress()

  console.log('Your Safe has been deployed:')
  console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
  console.log(`https://app.safe.global/gor:${safeAddress}`)

  // amount to transfer through transaction
  const safeAmount = ethers.utils.parseUnits('0.01', 'ether').toHexString()

  // transaction parameters
  const transactionParameters = {
    to: safeAddress,
    value: safeAmount,
  }

  // Send transaction
  const tx = await owner1Signer.sendTransaction(transactionParameters)
  const txURL = `https://goerli.etherscan.io/tx/${tx.hash}`
  const safeTxURL = `https://app.safe.global/gor:${safeAddress}`
  console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`)

  // Fetch balance from Safe address
  const beforeBalance = await safeSdk.getBalance()
  console.log(
    `The balance of the Safe after deploying contract : ${ethers.utils.formatUnits(
      beforeBalance,
      'ether',
    )} ETH`,
  )
  return { txURL, safeTxURL, safeSdk }
}
