import React, { createContext, useContext, useState } from 'react'

const SafeContext = createContext()

export const SafeProvider = ({ children }) => {
  const [sdk, setSdk] = useState(null)
  const [userAddr, setUserAddr] = useState([''])
  const [threshold, setThreshold] = useState(1)

  const setSafeSdk = (safeSdk) => {
    setSdk(safeSdk)
  }
  const setUserAddress = (userAddress) => {
    setUserAddr(userAddress)
  }

  const setThresholdValue = (threshold) => {
    setThreshold(threshold)
  }
  return (
    <SafeContext.Provider
      value={{
        sdk,
        setSafeSdk,
        userAddr,
        setUserAddress,
        threshold,
        setThresholdValue,
      }}
    >
      {children}
    </SafeContext.Provider>
  )
}

export const useSafeSdk = () => {
  const context = useContext(SafeContext)
  if (!context) {
    throw new Error('useSafeSdk must be used within a SafeProvider')
  }
  return context
}
