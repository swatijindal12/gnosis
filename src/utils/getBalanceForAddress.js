const Web3 = require('web3')

// Replace with your Ethereum node URL or Infura project ID
const providerUrl =
  'https://eth-goerli.g.alchemy.com/v2/Yr4FvM6pDQqSqKoxJQPTtEY2Bwvz-gIR'

const web3 = new Web3(providerUrl)

async function getBalanceForAddress(address) {
  try {
    const balanceWei = await web3.eth.getBalance(address)
    const balance = web3.utils.fromWei(balanceWei, 'ether')
    return { balance }
  } catch (error) {
    console.error('Error fetching balance:', error)
    throw error
  }
}

module.exports = { getBalanceForAddress }
