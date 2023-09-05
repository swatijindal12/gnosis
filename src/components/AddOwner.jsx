import React, { useState, useEffect } from 'react'
import './AddOwner.css'
import { useSafeSdk } from './SafeContext'

const AddOwner = ({ address, onCreateSafe }) => {
  const [ownerAddresses, setOwnerAddresses] = useState([address])
  const [threshold, setThreshold] = useState('') // Initialize threshold with 1
  const [thresholdError, setThresholdError] = useState(false)
  const { setUserAddress, setThresholdValue } = useSafeSdk() // Use the useSafeSdk hook

  const handleAddOwner = () => {
    setOwnerAddresses([...ownerAddresses, ''])
    setUserAddress([...ownerAddresses])
    console.log('user address is:', ownerAddresses)
  }

  const handleOwnerChange = (index, value) => {
    const updatedAddresses = [...ownerAddresses]
    updatedAddresses[index] = value
    setOwnerAddresses(updatedAddresses)
  }

  const handleThresholdChange = (e) => {
    const newThreshold = parseInt(e.target.value)
    if (newThreshold <= ownerAddresses.length) {
      setThreshold(newThreshold)
      setThresholdValue(newThreshold)
      setThresholdError(false)
    } else {
      setThresholdError(true)
    }
  }

  // Use useEffect to add an owner automatically when the component is loaded
  useEffect(() => {
    setOwnerAddresses([address])
  }, [address])

  return (
    <div className="add-owner-container">
      {/* Owner addresses */}
      {ownerAddresses.map((owner, index) => (
        <div key={index}>
          <label htmlFor={`ownerAddr${index}`} style={{ marginTop: '1rem' }}>
            User Address {index + 1}:
          </label>
          <input
            type="text"
            id={`ownerAddr${index}`}
            value={owner}
            onChange={(e) => handleOwnerChange(index, e.target.value)}
            placeholder="Enter user address"
            className="input-recipient"
          />
        </div>
      ))}

      {/* Threshold input */}
      <div>
        <label htmlFor="threshold" style={{ marginTop: '1rem' }}>
          Threshold:
        </label>
        <input
          type="number"
          id="threshold"
          value={threshold}
          onChange={handleThresholdChange}
          placeholder="Enter threshold"
          className={`input-recipient ${thresholdError ? 'error' : ''}`}
        />{' '}
        out of {ownerAddresses.length}
        {thresholdError && (
          <p className="error-text">
            Threshold cannot be greater than the number of owners.
          </p>
        )}
      </div>

      <button onClick={handleAddOwner}>Add Owner</button>
    </div>
  )
}

export default AddOwner
