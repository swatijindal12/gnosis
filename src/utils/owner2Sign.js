const ethers = require('ethers')
const Safe = require('@safe-global/protocol-kit').default
const SafeApiKit = require('@safe-global/api-kit').default
const { EthersAdapter } = require('@safe-global/protocol-kit')

const owner2Sign = async (recipientAddress, safeSdk, userAddr) => {
  // URL of goerli transaction safe service
  const txServiceUrl = 'https://safe-transaction-goerli.safe.global'

  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const owner1Addr = userAddr[0]
  const owner2Addr = userAddr[1]

  // Initialize signers
  const owner1Signer = provider.getSigner(owner1Addr)
  const owner2Signer = provider.getSigner(owner2Addr)

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

  // Fetch pending transaction of safe address
  const pendingTransactions = await safeService.getPendingTransactions(
    safeAddress,
  ).results
  console.log('Pending transactions : ', pendingTransactions)

  // Assumes that the first pending transaction is the transaction you want to confirm
  const safeTransactionHash = safeTxHash

  // initialize ETHERS adapter from owner 2
  const ethAdapterOwner2 = new EthersAdapter({
    ethers,
    signerOrProvider: owner2Signer,
  })

  // Initialize the protocol kit with owner 2
  const safeSdkOwner2 = await Safe.create({
    ethAdapter: ethAdapterOwner2,
    safeAddress,
  })

  console.log('SDK protocol kit initialized with 2nd owner')

  // Sign the transaction hash
  const signature = await safeSdkOwner2.signTransactionHash(safeTransactionHash)
  //  console.log('Signature of 2nd owner : ', signature)

  // Confirm the transaction
  const response = await safeService.confirmTransaction(
    safeTransactionHash,
    signature.data,
  )
  console.log('Transaction confirmation after 2nd owner signing : ', response)

  // Fetch the safe transaction using hash
  const safeTx = await safeService.getTransaction(safeTransactionHash)
  console.log('Transaction fetched after 2nd owner confirmation : ', safeTx)

  // Execute the transaction
  const executeTxResponse = await safeSdk.executeTransaction(safeTx)
  // console.log('Transaction executed : ', executeTxResponse)

  // Fetch the transaction receipt
  const receipt = await executeTxResponse.transactionResponse?.wait()
  console.log('Transaction receipt : ', receipt)

  const txReceipt = `https://goerli.etherscan.io/tx/${receipt.transactionHash}`
  // Fetch balance from Safe address
  const afterBalance = await safeSdk.getBalance()
  console.log(
    `The final balance of the Safe after sending transaction : ${ethers.utils.formatUnits(
      afterBalance,
      'ether',
    )} ETH`,
  )
  // const ownerAddr = owner2Signer.address
  const balanceWei = await provider.getBalance(owner2Addr)

  // Convert the balance from wei to ether
  const balanceEther = ethers.utils.formatEther(balanceWei)
  const ownerAddr = owner2Addr

  return { txReceipt, balanceEther, ownerAddr }
}

module.exports = { owner2Sign }
