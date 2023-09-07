import React from 'react'
import './Card.css'

const Card = ({ ownerData }) => {
  return (
    <div className="card-container">
      <div className="card">
        <div className="card-block">
          <h4>Owner signs the transaction</h4>
          <table className="table">
            <tbody>
              <tr>
                <td>Address:</td>
                <td>{ownerData.ownerAddr}</td>
              </tr>
              <tr>
                <td>Balance:</td>
                <td>{ownerData.balanceEther} ETH</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Card
