const Web3 = require('web3')

// Replace with your Ethereum node URL or Infura project ID
const providerUrl =
  'https://eth-goerli.g.alchemy.com/v2/MVShCQemQVVBERpva1XXSuGpp0vSphdi'

const web3 = new Web3(providerUrl)

export async function getBalanceForAddress(address) {
  try {
    const balanceWei = await web3.eth.getBalance(address)
    const balance = web3.utils.fromWei(balanceWei, 'ether')
    return { balance }
  } catch (error) {
    console.error('Error fetching balance:', error)
    throw error
  }
}
