import React from 'react'

const BalanceCard = ({ recipient, afterBalance, txReceipt }) => {
  return (
    <div className="card">
      <div className="card-block">
        <h4 style={{ fontSize: '1.5rem', color: 'green' }}>
          Funds Transfer Successfully!!
        </h4>
        <p>Recipient Address: {recipient}</p>
        <p>
          Tx hash:{' '}
          <a href={txReceipt} target="_blank">
            {txReceipt}
          </a>
        </p>

        {/* <p>Before Balance: {beforeBalance} ETH</p> */}
        <p>After Balance: {afterBalance.balance} ETH</p>
      </div>
    </div>
  )
}

export default BalanceCard
