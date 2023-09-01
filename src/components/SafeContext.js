import React, { createContext, useContext, useState } from 'react'

const SafeContext = createContext()

export const SafeProvider = ({ children }) => {
  const [sdk, setSdk] = useState(null)

  const setSafeSdk = (safeSdk) => {
    setSdk(safeSdk)
  }

  return (
    <SafeContext.Provider value={{ sdk, setSafeSdk }}>
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
