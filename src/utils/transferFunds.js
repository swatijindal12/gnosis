const ethers = require('ethers')
const SafeApiKit = require('@safe-global/api-kit').default
const { EthersAdapter } = require('@safe-global/protocol-kit')

const transferFunds = async (recipientAddress, safeSdk) => {
  const RPC_URL =
    'https://eth-goerli.g.alchemy.com/v2/...'

  // URL of goerli transaction safe service
  const txServiceUrl = 'https://safe-transaction-goerli.safe.global'

  // setup ethers using the RPC_URL
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

  const ACCOUNT_1_PRIVATE_KEY =
    '0x....'

  // Initialize signers
  const owner1Signer = new ethers.Wallet(ACCOUNT_1_PRIVATE_KEY, provider)
  // initialize ETHERS adapter from owner 1
  const ethAdapterOwner1 = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer,
  })

  console.log('Ethers adapter initialized...')

  // Initialize the API Kit
  const safeService = new SafeApiKit({
    txServiceUrl,
    ethAdapter: ethAdapterOwner1,
  })
  console.log('Safe service initialized...')

  const safeAddress = await safeSdk.getAddress()
  const destination = recipientAddress

  // Amount to transfer to the destination address
  const amount = ethers.utils.parseUnits('0.000000001', 'ether').toString()

  // transaction metadata
  const safeTransactionData = {
    to: destination,
    data: '0x',
    value: amount,
  }

  // Create a Safe transaction with the provided parameters
  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData,
  })
  console.log('Transaction created : ', safeTransaction)

  // Deterministic hash based on transaction parameters
  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
  console.log('Safe transaction hash : ', safeTxHash)

  // Sign transaction to verify that the transaction is coming from owner 1
  const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
  console.log('Sender signature : ', senderSignature)

  // Propose the transaction
  await safeService.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: await owner1Signer.getAddress(),
    senderSignature: senderSignature.data,
  })

  // Fetch pending transaction of safe address
  const pendingTransactions = await safeService.getPendingTransactions(
    safeAddress,
  ).results
  console.log('Pending transactions : ', pendingTransactions)

  // console.log('Owner 1 addr:', owner1Signer.address)
  const ownerAddr = owner1Signer.address
  const balanceWei = await provider.getBalance(owner1Signer.address)

  // Convert the balance from wei to ether
  const balanceEther = ethers.utils.formatEther(balanceWei)

  return { ownerAddr, balanceEther }
}

module.exports = { transferFunds }
