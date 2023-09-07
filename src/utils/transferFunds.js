const ethers = require('ethers')
const SafeApiKit = require('@safe-global/api-kit').default
const { EthersAdapter } = require('@safe-global/protocol-kit')

const transferFunds = async (recipientAddress, safeSdk, userAddr) => {
  // URL of goerli transaction safe service
  const txServiceUrl = 'https://safe-transaction-goerli.safe.global'

  // setup ethers using the RPC_URL
  // const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  // Initialize signers & Address
  const owner1Addr = userAddr[0]
  const owner1Signer = provider.getSigner(owner1Addr)

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
  const amount = ethers.utils.parseUnits('0.006', 'ether').toString()

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

  const balanceWei = await provider.getBalance(owner1Addr)

  // Convert the balance from wei to ether
  const balanceEther = ethers.utils.formatEther(balanceWei)
  const ownerAddr = owner1Addr
  return { ownerAddr, balanceEther }
}

module.exports = { transferFunds }
